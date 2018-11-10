const path = require('path')
const isWindows = process.platform === 'win32'

module.exports = isWindows ? {
  vampire: path.resolve(__dirname, '../vampire'),
  os: path.resolve(__dirname, '../vampire-os'),
  cert: path.resolve(__dirname, '../cert')
} : {
  vampire: '/var/www/vampire',
  os: '/var/www/vampire-os',
  cert: '/var/www/cert'
}
