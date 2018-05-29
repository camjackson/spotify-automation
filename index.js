const express = require('express');
const auth = require('./auth');
const buildPlaylist = require('./buildPlaylist');

const port = 8080;
const callbackEndpoint = 'callback';
const redirectUri = `http://localhost:${port}/${callbackEndpoint}`;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

let server;

if (!clientId) {
  console.error('CLIENT_ID is not set!');
  process.exit(1);
}

if (!clientSecret) {
  console.error('CLIENT_SECRET is not set!');
  process.exit(1);
}

const callback = (req, res) => {
  auth.getAccessToken(clientId, clientSecret, req.query.code, redirectUri).then((token) => {
    res.send('Building your playlist, switch back to the terminal!');

    buildPlaylist(token).then(() => {
      server.close();
    });
  });
};

const app = express();
app.get(`/${callbackEndpoint}`, callback);
server = app.listen(port, () => {
  auth.beginAuthFlow(clientId, redirectUri);
});
