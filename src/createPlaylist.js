const logger = require('./logger');
const initApi = require('./api');
const filteredTracks = require('../data/filtered.json');
const { chunkify } = require('./arrayUtils');

const tracks = filteredTracks.sort((a, b) => b.tempo - a.tempo);

const zeroPad = number => (number < 10 ? `0${number}` : number);

module.exports = auth => {
  const { get, post, postAll } = initApi(auth);

  return get('/me')
    .then(user => {
      const today = new Date();
      const formattedDate = `${today.getFullYear()}-${zeroPad(
        today.getMonth() + 1,
      )}-${zeroPad(today.getDate())}`;
      const playlist = {
        name: `Running ${formattedDate}`,
        description: `Auto-playlist of songs for running. Generated by github.com/camjackson/spotify/automation on ${formattedDate}`,
      };

      logger.log('-------------');
      logger.log(`Retrieved user ${user.id}`);
      logger.log(`Creating a new playlist called "${playlist.name}"`);

      return post(`/users/${user.id}/playlists`, playlist).then(newPlaylist => [
        newPlaylist,
        user,
      ]);
    })
    .then(([playlist, user]) => {
      logger.log('Playlist created succesfully!');
      logger.log('-------------\n');

      logger.log('-------------');
      logger.log(`Adding ${tracks.length} tracks to the playlist...`);

      const trackUriSets = chunkify(tracks, 100, track => track.uri);
      return postAll(
        `/users/${user.id}/playlists/${playlist.id}/tracks`,
        trackUriSets,
      ).then(() => [playlist, user]);
    })
    .then(([playlist, user]) => {
      logger.log('Tracks added succesfully succesfully!');
      return get(`/users/${user.id}/playlists/${playlist.id}`);
    })
    .then(playlist => {
      logger.log(`Playlist now has ${playlist.tracks.total} tracks!`);
      logger.log('-------------\n');
    });
};
