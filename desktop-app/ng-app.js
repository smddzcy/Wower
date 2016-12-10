const env = require('./env.js');
const app = angular.module('wowApp', []);

app.controller('LogController', ['$http', ($http) => {
	this.logs = [];
	$http.get(`${env.API_URL}/logs`)
		.then((resp) => {
			this.logs = resp.data.logs;
		});
}]);

app.controller('FileController', ['$http', ($http) => {
  this.files = [];
  $http.get(`${env.API_URL}/ufiles`)
    .then((resp) => {
      this.files = resp.data.ufiles;
    });
}]);
