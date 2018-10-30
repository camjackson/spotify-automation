const { flatten } = require('../arrayUtils');

const getArtistsAlbums = async ({ get }, artists) => {
  const allArtistsAllAlbums = await Promise.all(
    artists.map(artist =>
      get(
        `/v1/artists/${
          artist.id
        }/albums?limit=50&include_groups=album,single,compilation`,
      ),
    ),
  );
  const albums = flatten(allArtistsAllAlbums, 'items');

  // TODO: filter albums

  return albums;
};

module.exports = getArtistsAlbums;
