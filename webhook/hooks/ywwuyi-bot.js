const repo = 'Misaka-0x447f/ywwuyi-bot'
const LISTEN = `push:${repo}/master`
const events = require('..')

const { bot: cwd } = require('../../dir')
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
