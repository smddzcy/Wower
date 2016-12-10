const env = require('../env');
const rp = require('request-promise');

module.exports = {
	getLogs: () => {
		return rp(env.API_URL + "/logs");
	}
}
