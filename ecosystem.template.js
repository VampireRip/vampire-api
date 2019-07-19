// https://pm2.io/doc/en/runtime/reference/ecosystem-file/
module.exports = {
  apps: [{
    name: 'API',
    script: 'bin/www',
    instances: 1,
    autorestart: true,
    max_memory_restart: '512M',
    log_date_format: 'MM-DD HH:mm Z',
    env: {
      GITHUB_WEBHOOK_SECRET: '<什么奇怪的东西>'
    }
  }]
}
