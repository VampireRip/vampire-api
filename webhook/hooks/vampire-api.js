const LISTEN = 'push:vampire-rip/vampire-api/master'
const events = require('..')

const { api: cwd } = require('../../dir')
const utils = require('../utils')({
  cwd,
  repo: 'https://github.com/vampire-rip/vampire-api'
})

events.on(LISTEN, args => {
  const { repository } = args.payload
  utils.forceCheckoutAndRestart()
    .then(() => {
      console.log(`update to ${repository.name} succeed.`)
    }, error => {
      console.error(`update to ${repository.name} failed:`, error)
    })
})
