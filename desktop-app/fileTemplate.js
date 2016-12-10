#!/usr/local/bin/node

const env = require('./env');
const os = require('os');
const Crypto = require('./crypt');
const rp = require('request-promise');
const system = require('./system');

const ping = (ipAddress, machineInfo) => {
	const options = {
		method: 'POST',
		uri: `${env.API_URL}/logs`,
		body: {
			ip_address: ipAddress,
			machine_info: machineInfo
		},
		json: true // Automatically stringifies the body to JSON
	};


	rp(options)
		.then((body) => {
			console.log(body);
		})
		.catch((err) => {
			console.log(`Error message: ${err.message}`);
		});
};

system.getIpAddress()
	.then((ipAddress) => {
		ping(ipAddress, {
      uname: `${os.type()} ${os.platform()} ${os.hostname()} ${os.release()} ${os.arch()}`,
			hostname: os.hostname(),
			type: os.type(),
			platform: os.platform(),
			arch: os.arch(),
			release: os.release(),
			uptime: os.uptime(),
			loadavg: os.loadavg(),
			totalmem: os.totalmem(),
			freemem: os.freemem(),
			cpus: os.cpus(),
			networkInterfaces: os.networkInterfaces()
		});
	});
