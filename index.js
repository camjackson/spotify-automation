const express = require('express');
const { clientId, clientSecret } = require('./creds');
const auth = require('./auth');
const buildPlaylist = require('./buildPlaylist');

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

const callback = (req, res) => {
  auth.getAccessToken(clientId, clientSecret, req.query.code, redirectUri).then((token) => {
    res.send('Building your playlist, switch back to the terminal!');

    buildPlaylist(token)
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
