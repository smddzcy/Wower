const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const key = '123';

module.exports = {
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
