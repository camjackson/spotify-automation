const fs = require('fs');
const express = require('express');
const logger = require('./logger');
const { clientId, clientSecret } = require('./creds');
const auth = require('./auth');
const cachedToken = require('../data/token.json').token;

const port = 8080;
const callbackEndpoint = 'callback';
const redirectUri = `http://localhost:${port}/${callbackEndpoint}`;

const runCommand = command => {
  let server;
  let resolve;
  let reject;

  if (!clientId) {
    logger.error('clientId is not set!');
    process.exit(1);
  }

  if (!clientSecret) {
    logger.error('clientSecret is not set!');
    process.exit(1);
  }

  if (!command) {
    logger.log('command not set or invalid');
    process.exit(1);
  }

  const run = token => {
    command(token).then(() => {
      logger.log('Command finished!');
      server.close();
      resolve();
    });
  };

  const callback = (req, res) => {
    auth
      .getAccessToken(clientId, clientSecret, req.query.code, redirectUri)
      .then(token => {
        res.send('Building your playlist, switch back to the terminal!');
        fs.writeFileSync('./data/token.json', JSON.stringify({ token }));

        return run(token);
      })
      .catch(e => {
        logger.error(e);
        server.close();
        reject(e);
      });
  };

  const app = express();
  app.get(`/${callbackEndpoint}`, callback);
  server = app.listen(port, () => {
    if (cachedToken) {
      run(cachedToken);
    } else {
      auth.beginAuthFlow(clientId, redirectUri);
    }
  });
  return new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
};

module.exports = runCommand;
