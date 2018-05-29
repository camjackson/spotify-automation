const opn = require('opn');
const request = require('request-promise');

const scopes = encodeURIComponent([
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
].join(' '));

const beginAuthFlow = (clientId, redirect) => {
  const url = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scopes}&redirect_uri=${redirect}`;
  opn(url, { wait: false });
};

const getAccessToken = (clientId, clientSecret, code, redirect) => {
  const url = 'https://accounts.spotify.com/api/token';
  const form = {
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirect,
    client_id: clientId,
    client_secret: clientSecret,
  };

  return request.post(url, { form }).then(response => (
    `Bearer ${JSON.parse(response).access_token}`
  ));
};

module.exports = {
  beginAuthFlow,
  getAccessToken,
}
