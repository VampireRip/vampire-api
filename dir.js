const path = require('path')
const fs = require('fs')
const isWindows = process.platform === 'win32'

const host = {
  api: 'api.vampire.rip',
  vampire: 'vampire.rip',
  os: 'os.vampire.rip',
  bot: 'ywwuyi.vampire.rip',
  docs: 'docs.vampire.rip'
}

const base = isWindows
  ? path.resolve(__dirname, '../')
  : '/var/www/'

const resolved = {
  api: __dirname,
  vampire: path.resolve(base, host.vampire),
  os: path.resolve(base, host.os),
  bot: path.resolve(base, host.bot),
  docs: path.resolve(base, host.docs)
}

Object.keys(resolved).forEach(k => {
  if (!fs.existsSync(resolved[k])) { fs.mkdirSync(resolved[k]) }
})

module.exports = resolved
