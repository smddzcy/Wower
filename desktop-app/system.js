const exec = require('child_process').exec;

module.exports = {
  exec: (cmd) => {
    return new Promise((resolve, reject) => {
      exec(cmd, function(error, stdout, stderr) {
        if(stderr.length === 0) resolve(stdout);
        else if(error) reject(error.message);
        else reject(stderr);
      });
    });
  }
};
