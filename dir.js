const path = require('path')
const isWindows = process.platform === 'win32'

const host = {
  vampire: 'vampire.rip',
  os: 'os.vampire.rip',
  api: 'api.vampire.rip'
}

module.exports = isWindows ? {
  vampire: path.resolve(__dirname, '../', host.vampire),
  os: path.resolve(__dirname, '../', host.os)
} : {
  vampire: path.join('/var/www/', host.vampire),
  os: path.join('/var/www/vampire-os', host.os)
}
