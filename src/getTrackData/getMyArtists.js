const bannedArtists = [];

const getMyArtists = async ({ getAll }) => {
  const artists = await getAll(
    '/v1/me/following?type=artist&limit=50',
    'artists',
  );

  const banned = process.env.bannedArtists || bannedArtists;
  return artists.filter(artist => !banned.includes(artist.name));
};

module.exports = getMyArtists;
