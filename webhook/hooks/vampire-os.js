const LISTEN = 'push:vampire-rip/vampire-os/master'
const events = require('..')

const { os: cwd } = require('../../dir')
const utils = require('../utils')({
  cwd,
  repo: 'https://github.com/vampire-rip/vampire-os'
})

events.on(LISTEN, args => {
  const { repository } = args.payload
  utils.forceCheckoutAndUpdate()
    .then(() => {
      console.log(`update to ${repository.name} succeed.`)
    }, error => {
      console.error(`update to ${repository.name} failed:`, error)
    })
})
