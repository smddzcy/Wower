const env = require('./env.js');
const app = angular.module('wowApp', []);
const Crypto = require('./crypt');

app.controller('LogController', ['$http', function($http) {
	this.logs = [];
	$http.get(`${env.API_URL}/logs`)
		.then((resp) => {
			this.logs = resp.data.logs;
		});
}]);

app.controller('ListFileController', ['$http', function($http) {
	this.files = [];
	$http.get(`${env.API_URL}/ufiles`)
		.then((resp) => {
			this.files = resp.data.ufiles;
		});
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

app.controller('AddFileController', ['$http', function($http) {
  let _this = this;
  this.submitFile = () => {
    $http.post(`${env.API_URL}/ufiles`, {
  		name: _this.file.info.name,
  		path: _this.file.info.path,
  		data: _this.file.data
  	}).then((resp) => {
      console.log("Success!");
  	}, (err) => {
      console.log("Wowow, no, error message: " + err.message);
    });
  };
}]);
