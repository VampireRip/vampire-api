const { spawn } = require('child_process')

function spawnAsync (command, args, options) {
  const child = spawn(command, args, options)
  return new Promise(function (resolve, reject) {
    const _reject = (reason) => {
      console.error(command, 'rejected', reason)
      return reject(reason)
    }
    child.stderr.on('data', (data) => {
      console.log(command, `stderr: ${data}`)
    })
    child.addListener('error', reject)
    child.addListener('exit', code => {
      code === 0 ? resolve(code) : _reject(code)
    })
  })
}

module.exports = {
  spawn: spawnAsync
}
