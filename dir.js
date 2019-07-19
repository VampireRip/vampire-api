const path = require('path')
const isWindows = process.platform === 'win32'

const host = {
  api: 'api.vampire.rip',
  vampire: 'vampire.rip',
  os: 'os.vampire.rip',
  bot: 'ywwuyi.vampire.rip'
}

const base = isWindows
  ? path.resolve(__dirname, '../')
  : '/var/www/'

module.exports = {
  api: __dirname,
  vampire: path.resolve(base, host.vampire),
  os: path.resolve(base, host.os),
  bot: path.resolve(base, host.bot)
}
