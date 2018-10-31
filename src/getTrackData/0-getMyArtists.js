const filters = require('./filters');

const getMyArtists = async ({ getAll }) => {
  const artists = await getAll(
    '/v1/me/following?type=artist&limit=50',
    'artists',
  );

  return artists.filter(artist => !filters.bannedArtists.includes(artist.name));
};

module.exports = getMyArtists;
