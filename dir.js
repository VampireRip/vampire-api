const path = require('path');
const isWindows = process.platform === 'win32';

module.exports = isWindows ? {
  vampire: path.resolve(__dirname, '../vampire'),
  ctf: path.resolve(__dirname, '../ctf'),
  cert: path.resolve(__dirname, '../cert')
} : {
  vampire: '/var/www/vampire',
  ctf: '/var/www/ctf',
  cert: '/var/www/cert',
};
