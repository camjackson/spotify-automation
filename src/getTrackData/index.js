const fs = require('fs');
const logger = require('../logger');
const initApi = require('../api');
const getMyArtists = require('./0-getMyArtists');
const { checkForUnknownArtists } = require('./filters');
const getArtistsAlbums = require('./1-getArtistsAlbums');
const getAlbumTracks = require('./2-getAlbumTracks');
const getTrackFeatures = require('./3-getTrackFeatures');

module.exports = async auth => {
  const api = initApi(auth);

  const myArtists = await getMyArtists(api);

  logger.log('-------------');
  logger.log(`Fetched ${myArtists.length} (non-banned) artists:`);
  myArtists.forEach(artist => {
    logger.log(artist.name);
  });
  checkForUnknownArtists(myArtists);
  logger.log('-------------\n');

  const artistAlbums = await getArtistsAlbums(api, myArtists);

  logger.log('-------------');
  logger.log(`Listed ${artistAlbums.length} albums`);
  logger.log('Listing all their tracks...');
  logger.log('-------------\n');

  const tracks = await getAlbumTracks(api, artistAlbums);

  logger.log('-------------');
  logger.log(`Listed ${tracks.length} tracks`);
  logger.log('Fetching all their audio features...');
  logger.log('-------------\n');

  const trackFeatures = await getTrackFeatures(api, tracks);

  logger.log('-------------');
  logger.log(`Got features for ${trackFeatures.length} tracks`);
  logger.log('Caching the data to trackFeatures.json...');
  fs.writeFileSync(
    './data/trackFeatures.json',
    JSON.stringify(trackFeatures, null, 2),
  );
  logger.log('Done!');
  logger.log('-------------\n');
};
