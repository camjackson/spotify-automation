const logger = require('./logger');
const auth = require('./auth');

const runCommand = async command => {
  if (!command) {
    logger.log('command not set or invalid');
    process.exit(1);
  }

  const token = await auth.getToken();
  try {
    await command(token);
    logger.log('Command finished!');
  } catch (e) {
    logger.error(e);
  }
};

module.exports = runCommand;
