const createHandler = require('github-webhook-handler');
const handler = createHandler({secret: process.env.GITHUB_WEBHOOK_SECRET});

const dir = require('../dir');
const config = {
  cwd: dir.ctfApi
};
const git = require('./git')(config);
const {spawn} = require('./spawnAsync');
handler.on('error', ({code, error, req, res}) => {
  res.status(code).send({code, error});
});

handler.on('push', ({payload}) => {
  const {ref, repository} = payload;
  if (!ref.endsWith('master')) return;
  const tag = `${repository.name} on ${Date.now()}`;
  console.log(`receive update request: ${repository.name} on ${new Date}`);
  console.time(tag);
  git.forceCheckout().then(() =>
      spawn('python3', ['manage.py', ' migrate'], config)
  ).then(() =>
      spawn('pm2', ['restart', 'ctfApi'])
  ).then(() => {
      console.log(`update to ${repository.name} succeed.`);
      console.timeEnd(tag);
  })
});

module.exports = handler;
