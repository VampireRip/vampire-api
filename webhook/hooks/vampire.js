const LISTEN = 'push:vampire/vampire/master'
const events = require('..')

const { vampire: cwd } = require('../../dir')
const utils = require('../utils')({ cwd })

events.on(LISTEN, ({ repository }) => {
  utils.forceCheckoutAndUpdate()
    .then(() => {
      console.log(`update to ${repository.name} succeed.`)
    }, error => {
      console.error(`update to ${repository.name} failed:`, error)
    })
})
