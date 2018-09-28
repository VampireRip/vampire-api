const {spawn} = require('child_process');

function spawnAsync(command, args, options) {
  const child = spawn(command, args, options);
  return new Promise(function (resolve, reject) {
    child.addListener("error", reject);
    child.addListener("exit", code => {
      code === 0 ? resolve(code) : reject(code);
    });
  });
}

module.exports = {
  spawn: spawnAsync
};
