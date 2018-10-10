const fs = require('fs');
const logger = require('./logger');
const initApi = require('./api');
const { chunkify } = require('./arrayUtils');

module.exports = auth => {
  const { get, getSlowly, getAll } = initApi(auth);

  return getAll('/me/following?type=artist&limit=50', 'artists')
    .then(artists => {
      logger.log('-------------');
      logger.log(`Fetched ${artists.length} artists:`);
      artists.forEach(artist => {
        logger.log(artist.name);
      });
      logger.log('-------------\n');

      return Promise.all(
        artists.map(artist =>
          get(
            `/artists/${
              artist.id
            }/albums?limit=50&include_groups=album,single,compilation`,
            'albums',
          ),
        ),
      );
    })
    .then(allArtistsAllAlbums => {
      const albums = allArtistsAllAlbums.reduce(
        (result, artistAlbums) => result.concat(artistAlbums.items),
        [],
      );

      logger.log('-------------');
      logger.log(`Listed ${albums.length} albums`);
      logger.log('Listing all their tracks...');
      logger.log('-------------\n');

      const albumsUrls = chunkify(albums, 20, album => album.id).map(
        albumIds => `/albums?ids=${albumIds.join(',')}`,
      );
      return getSlowly(albumsUrls);
    })
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
        trackIds => `/audio-features?ids=${trackIds.join(',')}`,
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
