const repo = 'vampire-rip/vampire-api'
const LISTEN = `push:${repo}/master`
const events = require('..')

const { api: cwd } = require('../../dir')
const utils = require('../utils')({ cwd, repo })

events.on(LISTEN, args => {
  const { repository } = args.payload
  utils.forceCheckoutAndRestart()
    .then(() => {
      console.log(`update to ${repository.name} succeed.`)
    }, error => {
      console.error(`update to ${repository.name} failed:`, error)
    })
})
