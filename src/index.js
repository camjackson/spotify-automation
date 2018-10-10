const runCommand = require('./runCommand');
/* eslint-disable-next-line import/no-dynamic-require */
const command = require(`./${process.argv[2]}`);

runCommand(command);
