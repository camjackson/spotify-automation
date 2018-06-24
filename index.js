const express = require('express');
const { clientId, clientSecret } = require('./creds');
const auth = require('./auth');

/* eslint-disable-next-line import/no-dynamic-require */
const command = require(`./${process.argv[2]}`);

const port = 8080;
const callbackEndpoint = 'callback';
const redirectUri = `http://localhost:${port}/${callbackEndpoint}`;

let server;

if (!clientId) {
  console.error('clientId is not set!');
  process.exit(1);
}

if (!clientSecret) {
  console.error('clientSecret is not set!');
  process.exit(1);
}

if (!command) {
  console.log('command not set or invalid');
  process.exit(1);
}

const callback = (req, res) => {
  auth.getAccessToken(clientId, clientSecret, req.query.code, redirectUri).then((token) => {
    res.send('Building your playlist, switch back to the terminal!');

    command(token)
      .then(() => server.close())
      .catch((e) => {
        console.error(e);
        server.close();
      });
  });
};

const app = express();
app.get(`/${callbackEndpoint}`, callback);
server = app.listen(port, () => {
  auth.beginAuthFlow(clientId, redirectUri);
});
