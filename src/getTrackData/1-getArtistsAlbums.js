const filters = require('./filters');
const { flatten } = require('../arrayUtils');

const getArtistsAlbums = async ({ get }, artists) => {
  const allArtistsAllAlbums = await Promise.all(
    artists.map(async artist => {
      const whitelist = filters.artistsWithAlbumWhitelist[artist.name];
      const blacklist = filters.artistsWithAlbumBlacklist[artist.name];

      return (await get(
        `/v1/artists/${
          artist.id
        }/albums?limit=50&include_groups=album,single,compilation`,
      )).items.filter(
        album =>
          !(
            (blacklist && blacklist.includes(album.name)) ||
            (whitelist && !whitelist.includes(album.name))
          ),
      );
    }),
  );
  return flatten(allArtistsAllAlbums);
};

module.exports = getArtistsAlbums;
