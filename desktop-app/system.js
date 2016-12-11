const exec = require('child_process').exec;
const os = require('os');

module.exports = {
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
		return module.exports.exec("ipconfig getifaddr en0");
	},
	getMachineInfo: () => {
    let networkInterfaces = [];
    for(let key in os.networkInterfaces()) {
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
