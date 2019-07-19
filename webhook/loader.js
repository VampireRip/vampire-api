const fs = require('fs')
const path = require('path')
const events = require('./index')

const hooks = path.join(__dirname, 'hooks')

const updateHooks = () => {
  events.removeAllListeners()
  fs.readdirSync(hooks).forEach(file => {
    if (file.match(/\.js$/)) {
      const js = path.join(hooks, file)
      delete require.cache[require.resolve(js)]
      require(js)
    }
  })
}

updateHooks()
module.exports = (req, res, next) => {
  updateHooks()
  if (!req) return
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end('{"code":0, "message":"ok"}')
}
