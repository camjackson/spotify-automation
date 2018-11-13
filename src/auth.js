const fs = require('fs');
const express = require('express');
const opn = require('opn');
const request = require('request-promise');
const logger = require('./util/logger');
const { clientId, clientSecret } = require('./creds');
const cachedToken = require('../data/token.json').token;

const port = 8080;
const callbackEndpoint = 'callback';
const redirectUri = `http://localhost:${port}/${callbackEndpoint}`;

const scopes = encodeURIComponent(
  [
    'user-top-read',
    'user-read-recently-played',
    'user-library-modify',
    'user-library-read',
    'playlist-modify-public',
    'playlist-modify-private',
    'playlist-read-collaborative',
    'playlist-read-private',
    'user-read-private',
    'user-read-email',
    'user-read-birthdate',
    'user-follow-modify',
    'user-follow-read',
    'user-read-currently-playing',
    'user-read-playback-state',
    'user-modify-playback-state',
    'streaming',
  ].join(' '),
);

const requestToken = code => {
  const url = 'https://accounts.spotify.com/api/token';
  const form = {
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    client_secret: clientSecret,
  };

  return request
    .post(url, { form })
    .then(response => `Bearer ${JSON.parse(response).access_token}`);
};

const newPromise = () => {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

const getToken = async useCache => {
  if (cachedToken && useCache) {
    return cachedToken;
  }
  if (!clientId) {
    logger.error('clientId is not set!');
    process.exit(1);
  }

  if (!clientSecret) {
    logger.error('clientSecret is not set!');
    process.exit(1);
  }
  let server;
  const { promise, resolve, reject } = newPromise();

  const callback = async (req, res) => {
    try {
      const token = await requestToken(req.query.code);
      res.send('Successfully authorised, switch back to the terminal!');
      fs.writeFileSync('./data/token.json', JSON.stringify({ token }));
      resolve(token);
    } catch (e) {
      logger.error(e);
      reject(e);
    }
    server.close();
  };

  const app = express();
  app.get(`/${callbackEndpoint}`, callback);

  server = app.listen(port, () => {
    const url = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}`;
    opn(url, { wait: false });
  });
  return promise;
};

module.exports = {
  getToken,
};
