const express = require('express');
const logger = require('./logger');
const { clientId, clientSecret } = require('./creds');
const auth = require('./auth');

const port = 8080;
const callbackEndpoint = 'callback';
const redirectUri = `http://localhost:${port}/${callbackEndpoint}`;

const runCommand = command => {
  let server;

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

  const callback = (req, res) => {
    auth
      .getAccessToken(clientId, clientSecret, req.query.code, redirectUri)
      .then(token => {
        res.send('Building your playlist, switch back to the terminal!');

        command(token)
          .then(() => server.close())
          .catch(e => {
            logger.error(e.message);
            server.close();
          });
      })
      .catch(e => {
        logger.error(e.message);
        server.close();
      });
  };

  const app = express();
  app.get(`/${callbackEndpoint}`, callback);
  server = app.listen(port, () => {
    auth.beginAuthFlow(clientId, redirectUri);
  });
};

module.exports = runCommand;
