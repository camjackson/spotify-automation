const { chunkify, flatten } = require('../util/arrayUtils');

const getAlbumTracks = async ({ getSlowly }, artistAlbums) => {
  const albumsUrls = chunkify(artistAlbums, 20, album => album.id).map(
    albumIds => `/v1/albums?ids=${albumIds.join(',')}`,
  );
  const albums = flatten(await getSlowly(albumsUrls), 'albums');

  const allAlbumsAllTracks = albums.map(album =>
    album.tracks.items.map(track =>
      Object.assign({}, track, { album: album.name }),
    ),
  );
  return flatten(allAlbumsAllTracks);
};

module.exports = getAlbumTracks;
