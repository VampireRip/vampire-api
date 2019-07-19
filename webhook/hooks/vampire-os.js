const LISTEN = 'push:vampire/vampire-os/master'
const events = require('..')

const { os: cwd } = require('../../dir')
const utils = require('../utils')({ cwd })

events.on(LISTEN, ({ repository }) => {
  utils.forceCheckoutAndUpdate()
    .then(() => {
      console.log(`update to ${repository.name} succeed.`)
    }, error => {
      console.error(`update to ${repository.name} failed:`, error)
    })
})
