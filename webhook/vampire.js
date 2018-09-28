const createHandler = require('github-webhook-handler');
const handler = createHandler({secret: process.env.GITHUB_WEBHOOK_SECRET});
const dir = require('../dir');
const git = require('./git')({
  cwd: dir.vampire,
});
handler.on('error', ({code, error, req, res}) => {
  res.status(code).send({code, error});
});

handler.on('push', ({payload}) => {
  const {ref, repository} = payload;
  if (!ref.endsWith('master')) return;
  const tag = `${repository.name} on ${Date.now()}`;
  console.log(`receive update request: ${repository.name} on ${new Date}`);
  console.time(tag);
  git.forceCheckoutAndUpdate().then(() => {
        console.log(`update to ${repository.name} succeed.`);
        console.timeEnd(tag);
      },
  ).catch(error => {
        console.error(`update to ${repository.name} failed:`, error);
        console.timeEnd(tag);
      },
  );
});

module.exports = handler;
