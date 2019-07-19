const LISTEN = 'push:vampire/vampire-api/master'
const events = '..'

const { api: cwd } = require('../../dir')
const utils = require('../utils')({ cwd })

events.on(LISTEN, ({ repository }) => {
  utils.forceCheckoutAndRestart()
    .then(() => {
      console.log(`update to ${repository.name} succeed.`)
    }, error => {
      console.error(`update to ${repository.name} failed:`, error)
    })
})
