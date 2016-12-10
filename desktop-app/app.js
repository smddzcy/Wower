const fs = require('fs');
const Crypto = require('./crypt');
const system = require('./system');

$('#upload-input').on('change', function() {
	const files = $(this).get(0).files;
	if (files.length > 0) {
		const filePath = files[0].path;
		fs.readFile(filePath, 'utf8', function(err, data) {
			if (err) {
				return console.log(err);
			}

			const encryptedData = Crypto.encrypt(data);
			console.log(encryptedData);
			

		});
	}
});
