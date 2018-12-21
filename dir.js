const path = require('path')
const isWindows = process.platform === 'win32'

const host = {
  vampire: 'vampire.rip',
  os: 'os.vampire.rip',
  api: 'api.vampire.rip'
}

const base = isWindows
  ? path.resolve(__dirname, '../')
  : '/var/www/'

module.exports = {
  vampire: path.resolve(base, host.vampire),
  os: path.resolve(base, host.os)
}
