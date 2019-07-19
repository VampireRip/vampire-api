const { spawn } = require('./spawn')
const fs = require('fs')
const path = require('path')

module.exports = config => {
  const forceCheckout = () => Promise.resolve()
    .then(() =>
      spawn('git', ['clean', '-fd'], config)
    ).catch(e => {
      if (e === 128) { spawn('git', ['clone', config.repo, config.cwd], config) } else throw new Error('git returned ' + e)
    })
    .then(() =>
      spawn('git', ['fetch', '--all'], config)
    )
    .then(() =>
      spawn('git', ['reset', '--hard', 'origin/master'], config)
    )

  const npmUpdate = () => Promise.resolve()
    .then(() =>
      spawn('npm', ['install'], config)
    )
    .then(() =>
      spawn('npm', ['run', 'build'], config)
    )

  const restartNode = () => Promise.resolve()
    .then(() => {
      let c

      fs.existsSync(c = path.join(config.cwd, 'ecosystem.config.js')) ||
      fs.existsSync(c = path.join(config.cwd, 'ecosystem.config.json')) ||
      fs.existsSync(c = path.join(config.cwd, 'ecosystem.config.yaml')) ||
      (c = null)

      if (c === null && fs.existsSync(c = path.join(config.cwd, 'package.json'))) {
        const json = fs.readFileSync(c)
        c = json.main || json.entry
      }
      return c ? spawn('pm2', ['start', '-f', c]) : Promise.reject(new Error('no entry point found at ' + config.cwd))
    })

  return {
    forceCheckout,
    forceCheckoutAndUpdate: () => forceCheckout().then(npmUpdate),
    forceCheckoutAndRestart: () => forceCheckout().then(restartNode)
  }
}
