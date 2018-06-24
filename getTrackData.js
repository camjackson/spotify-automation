const fs = require('fs');
const initApi = require('./api');
const { chunkify } = require('./arrayUtils');

module.exports = (auth) => {
  const { get, getSlowly, getAll } = initApi(auth);

  return getAll('/me/following?type=artist&limit=50', 'artists')
    .then(artists => {
      console.log('-------------');
      console.log(`Fetched ${artists.length} artists:`);
      artists.forEach(artist => {
        console.log(artist.name);
      });
      console.log('-------------\n');

      return Promise.all(artists.map(artist => (
        get(`/artists/${artist.id}/albums?limit=50&include_groups=album,single,compilation`, 'albums')
      )));
    })
    .then(allArtistsAllAlbums => {
      const albums = allArtistsAllAlbums.reduce((result, artistAlbums) => (
        result.concat(artistAlbums.items)
      ), []);

      console.log('-------------');
      console.log(`Listed ${albums.length} albums`);
      console.log('Listing all their tracks...');
      console.log('-------------\n');

      const albumsUrls = chunkify(albums, 20, album => album.id)
        .map(albumIds => `/albums?ids=${albumIds.join(',')}`);
      return getSlowly(albumsUrls);
    })
    .then(albumChunks => {
      const albums = albumChunks.reduce((result, albumChunk) => result.concat(albumChunk.albums), []);
      const allAlbumsAllTracks = albums.map(album => album.tracks.items);
      const tracks = allAlbumsAllTracks.reduce((result, albumTracks) => result.concat(albumTracks), []);
      const trackMap = tracks.reduce((result, track) => Object.assign(result, { [track.id]: track }), {});

      console.log('-------------');
      console.log(`Listed ${tracks.length} tracks`);
      console.log('Fetching all their audio features...');
      console.log('-------------\n');

      const trackFeaturesUrls = chunkify(tracks, 100, track => track.id)
        .map(trackIds => `/audio-features?ids=${trackIds.join(',')}`);
      return getSlowly(trackFeaturesUrls)
        .then(result => [result, trackMap]);
    })
    .then(([trackFeatureGroups, trackMap]) => {
      const trackFeatures = trackFeatureGroups
        .reduce((result, trackFeatureGroup) => result.concat(trackFeatureGroup.audio_features), [])
        .filter(track => !!track)
        .map(track => Object.assign(track, {
          name: trackMap[track.id].name,
          artists: trackMap[track.id].artists.map(artist => artist.name),
        }));

      console.log('-------------');
      console.log(`Got features for ${trackFeatures.length} tracks`);
      console.log('Caching the data to trackFeatures.json...');
      fs.writeFileSync('./trackFeatures.json', JSON.stringify(trackFeatures, null, 2));
      console.log('Done!');
      console.log('-------------\n');
    });
};
