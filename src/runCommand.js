const logger = require('./logger');
const auth = require('./auth');

const runCommand = async (command, useCache) => {
  if (!command) {
    logger.log('command not set or invalid');
    process.exit(1);
  }

  const token = await auth.getToken(useCache);
  try {
    await command(token, useCache);
    logger.log('Command finished!');
  } catch (e) {
    logger.error(e);
  }
};

module.exports = runCommand;
