const request = require('request-promise');

const options = {
  json: true,
  headers: {
    'Accept': '*/*',
    'Authorization': 'Bearer i am a secret',
  },
};

const get = uri => request(Object.assign({}, options, { uri, method: 'GET' }));

const blacklist = ['London Grammar']

get('https://api.spotify.com/v1/me/following?type=artist&limit=50')
  .then(result => {
    console.log(result.artists.items.length);
    console.log(result.artists.items.filter(artist => !blacklist.includes(artist.name)).length);
  });

/*
https://beta.developer.spotify.com/documentation/web-api/reference/follow/get-followed/
https://beta.developer.spotify.com/documentation/web-api/reference/artists/get-artists-albums/
https://beta.developer.spotify.com/documentation/web-api/reference/albums/get-albums-tracks/
https://beta.developer.spotify.com/documentation/web-api/reference/tracks/get-audio-features/
*/
