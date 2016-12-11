const env = require('./env.js');
const Crypto = require('./crypt');
const system = require('./system');
const fs = require('fs');
const app = angular.module('wowApp', []);

app.controller('LogController', ['$http', '$rootScope', function($http, $rootScope) {
	this.getLogs = () => {
		$http.get(`${env.API_URL}/logs`)
			.then((resp) => {
				$rootScope.logs = resp.data.logs;
				console.log(resp.data.logs);
			});
	};
}]);

app.controller('ListFileController', ['$http', '$rootScope', function($http, $rootScope) {
	this.getFiles = () => {
		$http.get(`${env.API_URL}/ufiles`)
			.then((resp) => {
				$rootScope.files = resp.data.ufiles;
				console.log(resp.data.ufiles);
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
	return fs.readFileSync('fileTemplate.js', 'utf8')
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
				fs.writeFileSync(filePath, getExecutableFile(resp.data.ufile.id, fileType), 'binary');
				system.exec('chmod +x \'' + filePath + '\'').then(() => {
					swal({
						title: "Saved.",
						text: "Secured file is saved to the original file's path.",
						type: "success"
					});
				});
			});
		}, (err) => {
			console.log("Wowow, no, error message: " + err.message);
		});
	};
}]);

app.controller('AuthController', ['$http', function($http) {
	this.trustThisIpAddress = () => {
		system.getIpAddress()
			.then((ipAddress) => {
				$http.post(`${env.API_URL}/trusted_ips/`, {
					ip: ipAddress
				}).then((resp) => {
					console.log("Wow, successfully added your IP address.")
				}, (err) => {
					console.log("Couldn't add IP address, error message: " + err.message);
				});
			});
	};

	this.trustThisMachine = () => {
		$http.post(`${env.API_URL}/trusted_machines/`, {
			info: system.getMachineInfo()
		}).then((resp) => {
			console.log("Wow, successfully added your machine.")
		}, (err) => {
			console.log("Couldn't add machine, error message: " + err.message);
		});
	};
}]);
