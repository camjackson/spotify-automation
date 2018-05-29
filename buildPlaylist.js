const createGetters = require('./getters');

const blacklist = ['London Grammar'];

module.exports = (auth) => {
  const { get, getAll } = createGetters(auth);

  return getAll('https://api.spotify.com/v1/me/following?type=artist&limit=50', 'artists')
    .then(result => {
      console.log(JSON.stringify(result, null, 2));
      console.log(result.length);
      console.log(result.filter(artist => !blacklist.includes(artist.name)).length);
    });
}

/*
https://beta.developer.spotify.com/documentation/web-api/reference/follow/get-followed/
https://beta.developer.spotify.com/documentation/web-api/reference/artists/get-artists-albums/
https://beta.developer.spotify.com/documentation/web-api/reference/albums/get-albums-tracks/
https://beta.developer.spotify.com/documentation/web-api/reference/tracks/get-audio-features/
*/
