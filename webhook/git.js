const {spawn} = require('./spawnAsync');

module.exports = config => {
  const forceCheckout = () => spawn('git', ['clean', '-fd'], config).then(() =>
      spawn('git', ['fetch', '--all'], config),
  ).then(() =>
      spawn('git', ['reset', '--hard', 'origin/master'], config),
  );

  const npmUpdate = () => spawn('npm', ['install'], config).then(() =>
      spawn('npm', ['run', 'build'], config),
  );

  return {
    forceCheckout: forceCheckout,
    forceCheckoutAndUpdate() {
      return forceCheckout().then(()=>npmUpdate())
    },
  };
};
