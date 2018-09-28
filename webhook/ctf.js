const createHandler = require('github-webhook-handler');
const handler = createHandler({secret: process.env.GITHUB_WEBHOOK_SECRET});
const dir = require('../dir');
const git = require('./git')({
  cwd: dir.ctf
});
handler.on('error', ({code, error, req, res}) => {
  res.status(code).send({code, error});
});

handler.on('push', ({payload}) => {
  const {ref, repository} = payload;
  if (!ref.endsWith('master')) return;

  git.forceCheckoutAndUpdate().then(() =>
      console.log(`push to ${repository.name} succeed.`)
  ).catch(error =>
      console.error(`push to ${repository.name} failed: `, error)
  )
});

module.exports = handler;
