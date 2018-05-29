const fs = require('fs');
const createGetters = require('./getters');
const baseUrl = 'https://api.spotify.com/v1';

const blacklist = ['London Grammar'];

module.exports = (auth) => {
  const { get, getSlowly, getAll } = createGetters(auth);

  return getAll(`${baseUrl}/me/following?type=artist&limit=50`, 'artists')
    .then(artists => {
      console.log('-------------');
      console.log(`Fetched ${artists.length} artists. Filtering...`);
      const filtered = artists.filter(artist => !blacklist.includes(artist.name));
      console.log('Filtered down to these artists:');
      filtered.forEach(artist => {
        console.log(artist.name);
      });
      console.log('-------------\n\n');

      return Promise.all(filtered.map(artist => get(`${baseUrl}/artists/${artist.id}/albums?limit=50`, 'albums')));
    })
    .then(allArtistsAllAlbums => {
      const albums = allArtistsAllAlbums.reduce((result, artistAlbums) => (
        result.concat(artistAlbums.items)
      ), []);

      console.log('-------------');
      console.log(`Listed ${albums.length} albums:`);
      console.log('-------------\n\n');

      const albumsUrls = [];
      const numberOfAlbumsRequests = Math.ceil(albums.length / 20);
      for (let i = 0; i < numberOfAlbumsRequests; i++) {
        const albumIds = albums.slice(i * 20, (i+1) * 20).map(album => album.id).join(',');
        albumsUrls.push(`${baseUrl}/albums?ids=${albumIds}`);
      }
      return getSlowly(albumsUrls);
    })
    .then(albumChunks => {
      const albums = albumChunks.reduce((result, albumChunk) => result.concat(albumChunk.albums), []);
      const allAlbumsAllTracks = albums.map(album => album.tracks.items);
      const tracks = allAlbumsAllTracks.reduce((result, albumTracks) => result.concat(albumTracks), []);

      console.log('-------------');
      console.log(`Listed ${tracks.length} tracks`);
      console.log('Fetching all their audio features...');
      console.log('-------------\n\n');

      const trackFeaturesUrls = [];
      const numberOfTrackFeaturesRequests = Math.ceil(tracks.length / 100);
      for (let i = 0; i < numberOfTrackFeaturesRequests; i++) {
        const trackIds = tracks.slice(i * 100, (i+1) * 100).map(track => track.id).join(',');
        trackFeaturesUrls.push(`${baseUrl}/audio-features?ids=${trackIds}`);
      }
      return getSlowly(trackFeaturesUrls);
    })
    .then(trackFeatureGroups => {
      const trackFeatures = trackFeatureGroups.reduce((result, trackFeatureGroup) => result.concat(trackFeatureGroup.audio_features), []);

      console.log('-------------');
      console.log(`Got features for ${trackFeatures.length} tracks`);
      console.log('Caching the data to trackFeatures.json...');
      fs.writeFileSync('./trackFeatures.json', JSON.stringify(trackFeatures, null, 2));
      console.log('Done!');
      console.log('-------------\n\n');
    });
}
