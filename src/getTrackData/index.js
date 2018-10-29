const fs = require('fs');
const logger = require('../logger');
const initApi = require('../api');
const { chunkify } = require('../arrayUtils');
const getMyArtists = require('./getMyArtists');
const getArtistsAlbums = require('./getArtistsAlbums');

module.exports = async auth => {
  const api = initApi(auth);
  const { getSlowly } = api;

  const myArtists = await getMyArtists(api);

  logger.log('-------------');
  logger.log(`Fetched ${myArtists.length} (non-banned) artists:`);
  myArtists.forEach(artist => {
    logger.log(artist.name);
  });
  logger.log('-------------\n');

  const artistAlbums = await getArtistsAlbums(api, myArtists);

  logger.log('-------------');
  logger.log(`Listed ${artistAlbums.length} albums`);
  logger.log('Listing all their tracks...');
  logger.log('-------------\n');

  const albumsUrls = chunkify(artistAlbums, 20, album => album.id).map(
    albumIds => `/v1/albums?ids=${albumIds.join(',')}`,
  );
  return getSlowly(albumsUrls)
    .then(albumChunks => {
      const albums = albumChunks.reduce(
        (result, albumChunk) => result.concat(albumChunk.albums),
        [],
      );
      const allAlbumsAllTracks = albums.map(album =>
        album.tracks.items.map(track =>
          Object.assign({}, track, { album: album.name }),
        ),
      );
      const tracks = allAlbumsAllTracks.reduce(
        (result, albumTracks) => result.concat(albumTracks),
        [],
      );
      const trackMap = tracks.reduce(
        (result, track) => Object.assign(result, { [track.id]: track }),
        {},
      );

      logger.log('-------------');
      logger.log(`Listed ${tracks.length} tracks`);
      logger.log('Fetching all their audio features...');
      logger.log('-------------\n');

      const trackFeaturesUrls = chunkify(tracks, 100, track => track.id).map(
        trackIds => `/v1/audio-features?ids=${trackIds.join(',')}`,
      );
      return getSlowly(trackFeaturesUrls).then(result => [result, trackMap]);
    })
    .then(([trackFeatureGroups, trackMap]) => {
      const trackFeatures = trackFeatureGroups
        .reduce(
          (result, trackFeatureGroup) =>
            result.concat(trackFeatureGroup.audio_features),
          [],
        )
        .filter(track => !!track)
        .map(track =>
          Object.assign(track, {
            name: trackMap[track.id].name,
            artists: trackMap[track.id].artists.map(artist => artist.name),
            album: trackMap[track.id].album,
          }),
        );

      logger.log('-------------');
      logger.log(`Got features for ${trackFeatures.length} tracks`);
      logger.log('Caching the data to trackFeatures.json...');
      fs.writeFileSync(
        './data/trackFeatures.json',
        JSON.stringify(trackFeatures, null, 2),
      );
      logger.log('Done!');
      logger.log('-------------\n');
    });
};
