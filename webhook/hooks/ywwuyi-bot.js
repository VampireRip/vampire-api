const LISTEN = 'push:Misaka-0x447f/ywwuyi-bot/master'
const events = '..'

const { bot: cwd } = require('../../dir')
const utils = require('../utils')({ cwd })

events.on(LISTEN, ({ repository }) => {
  utils.forceCheckoutAndRestart()
    .then(() => {
      console.log(`update to ${repository.name} succeed.`)
    }, error => {
      console.error(`update to ${repository.name} failed:`, error)
    })
})
