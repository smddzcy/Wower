const app = angular.module('wowApp', []);
const rq = require('electron-require');
const fs = rq.remote('fs');
const env = rq('./env.js');
const crypto = rq.remote('crypto');
const algorithm = 'aes-256-ctr';
const key = '123';
const Crypto = {
	encrypt: (data) => {
    const cipher = crypto.createCipher(algorithm, key)
  	let crypted = cipher.update(data, 'utf8', 'hex')
  	crypted += cipher.final('hex');
  	return crypted;
	},
	decrypt: (data) => {
    const decipher = crypto.createDecipher(algorithm, key)
  	let dec = decipher.update(data, 'hex', 'utf8')
  	dec += decipher.final('utf8');
  	return dec;
	}
};
const exec = rq.remote('child_process').exec;
const os = rq.remote('os');
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
const path = require('path');

app.controller('LogController', ['$http', '$rootScope', function($http, $rootScope) {
	$rootScope.showModal = (log) => {
		const jsonText = JSON.stringify(log.machine_info, undefined, 2).trim();
		swal({
			title: `Log#${log.id} Machine Info`,
			text: jsonText.substring(1, jsonText.length - 2)
		});
	};
	this.getLogs = () => {
		if ($rootScope.gettingLogs) return;
		$rootScope.gettingLogs = true;
		$http.get(`${env.API_URL}/logs`)
			.then((resp) => {
				$rootScope.logs = resp.data.logs;
				$rootScope.gettingLogs = false;
				console.log(resp.data.logs);
			});
	};

	if (!$rootScope.logs ||  $rootScope.logs.length === 0) {
		this.getLogs();
	}
}]);

app.controller('ListFileController', ['$http', '$rootScope', function($http, $rootScope) {
	this.getFiles = () => {
		if ($rootScope.gettingFiles) return;
		$rootScope.gettingFiles = true;
		$http.get(`${env.API_URL}/ufiles`)
			.then((resp) => {
				$rootScope.files = resp.data.ufiles;
				$rootScope.gettingFiles = false;
				console.log(resp.data.ufiles);
			});
	};

	if (!$rootScope.files ||  $rootScope.files.length === 0) {
		this.getFiles();
	}

	$rootScope.deleteFile = (fileId) => {
		$http.delete(`${env.API_URL}/ufiles/${fileId}`)
			.then((resp) => {
				swal({
					title: "Success!",
					text: "Your file is successfully deleted. Note that it'll be deleted from all other machines too.",
					type: "success"
				});
				this.getFiles();
			})
			.catch((err) => {
				swal({
					title: "Error!",
					text: "Server returned an error.",
					type: "error"
				});
			});
	};
}]);

app.directive('fileModel', ['$parse', function($parse) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			const encryptFile = (fileData) => {
				return Crypto.encrypt(atob(fileData.substr(fileData.indexOf(',') + 1)));
			};

			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;
			element.bind("change", function(changeEvent) {
				var reader = new FileReader();
				reader.onload = function(loadEvent) {
					scope.$apply(function() {
						modelSetter(scope, {
							info: changeEvent.target.files[0],
							data: encryptFile(loadEvent.target.result)
						});
					});
				}
				reader.readAsDataURL(changeEvent.target.files[0]);
			});
		}
	};
}]);

const getExecutableFile = (fileId, fileType) => {
	return fs.readFileSync(path.join(__dirname, 'fileTemplate.js'), 'utf8')
		.replace('#FILE_ID#', fileId)
		.replace('#FILE_TYPE#', fileType);
};

app.controller('AddFileController', ['$http', function($http) {
	let _this = this;
	this.submitFile = () => {
		$http.post(`${env.API_URL}/ufiles`, {
			name: _this.file.info.name,
			path: _this.file.info.path,
			data: _this.file.data
		}).then((resp) => {
			swal({
				title: "Success!",
				text: "Your file is successfully added!",
				type: "success",
				confirmButtonText: "Download secured file",
				closeOnConfirm: false
			}, function() {
				const filePath = resp.data.ufile.path.replace(/(.*)(\.\w+)/, '$1-secured').replace('.', '-');
				const fileType = resp.data.ufile.name.substr(resp.data.ufile.name.indexOf('.') + 1);

				fs.writeFileSync(filePath, getExecutableFile(resp.data.ufile.id, fileType), 'utf8');
				system.exec('chmod +x \'' + filePath + '\'').then(() => {
					swal({
						title: "Saved.",
						text: "Secured file is saved to the original file's path.",
						type: "success"
					});
				}).catch((err) => {
					swal({
						title: "Error!",
						text: "Server returned an error.",
						type: "error"
					});
					console.log(err);
				});
			});
		}, (err) => {
			console.log(err);
		});
	};
}]);

app.controller('AuthController', ['$http', '$scope', '$rootScope', function($http, $scope, $rootScope) {
	$rootScope.loadTrustedMachines = () => {
		$http.get(`${env.API_URL}/trusted_machines`)
			.then((resp) => {
				$rootScope.machines = resp.data.trusted_machines;
			}, (err) => {
				console.log("error:" + JSON.stringify(err));
			});
	};

	$rootScope.loadTrustedIps = () => {
		$http.get(`${env.API_URL}/trusted_ips`)
			.then((resp) => {
				$rootScope.ips = resp.data.trusted_ips.map((ipObj) => ipObj.ip);
			}, (err) => {
				console.log("error:" + JSON.stringify(err));
			});
	};

  $rootScope.loadTrustedMachines();
  $rootScope.loadTrustedIps();

  this.trustThisIpAddress = () => {
		system.getIpAddress()
			.then((ipAddress) => {
				$http.post(`${env.API_URL}/trusted_ips/`, {
					ip: ipAddress
				}).then((resp) => {
					swal({
						title: "Success!",
						text: "Your IP address is successfully added to the trusted IP addresses.",
						type: "success"
					});

          $rootScope.loadTrustedIps();
				}, (err) => {
					swal({
						title: "Error!",
						text: "Server returned an error.",
						type: "error"
					});
					console.log(err);
				});
			});
	};

	this.trustThisMachine = () => {
		$http.post(`${env.API_URL}/trusted_machines/`, {
			info: system.getMachineInfo()
		}).then((resp) => {
			swal({
				title: "Success!",
				text: "This machine is successfully added to the trusted machines.",
				type: "success"
			});

      $rootScope.loadTrustedMachines();
		}, (err) => {
			swal({
				title: "Error!",
				text: "Server returned an error.",
				type: "error"
			});
			console.log(err);
		});
	};
}]);
