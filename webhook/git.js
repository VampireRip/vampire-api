const {spawn} = require('./spawnAsync');

module.exports = config => {
  return {
    forceCheckoutAndUpdate() {
      return spawn('git', ['clean', '-fd'], config).then(() =>
          spawn('git', ['fetch', '--all'], config)
      ).then(() =>
          spawn('git', ['reset', '--hard', 'origin/master'], config)
      ).then(() =>
          spawn('npm', ['install'], config)
      ).then(() =>
          spawn('npm', ['run', 'build'], config)
      )
    }
  };
};
