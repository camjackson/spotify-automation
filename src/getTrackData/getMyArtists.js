const bannedArtists = [
  'Jakob',
  'From Monument To Masses',
  'Perturbator',
  'If These Trees Could Talk',
  'Owane',
  'Stan Forebee',
  'Ludovico Einaudi',
  'Mogwai',
  'London Grammar',
  'Long Distance Calling',
  'Scroobius Pip',
  'Limes',
  'Animals As Leaders',
  '65daysofstatic',
  'Sizzle Bird',
  'City and Colour',
];

const getMyArtists = async ({ getAll }) => {
  const artists = await getAll(
    '/v1/me/following?type=artist&limit=50',
    'artists',
  );

  const banned = process.env.bannedArtists || bannedArtists;
  return artists.filter(artist => !banned.includes(artist.name));
};

module.exports = getMyArtists;
