const logger = require('../logger');

const aristsWhoDoNotGetFiltered = [
  'Skyharbor',
  'TesseracT',
  'Voices From The Fuselage',
  'Periphery',
  'Killing Heidi',
  'Cog',
  'Karnivool',
  'Solar Fields',
];

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

const artistsWithAlbumWhitelist = {
  SBTRKT: ['SBTRKT'],
  'The Presets': ['Apocalypso'],
  Disturbed: [
    'The Sickness',
    'Believe (PA Version)',
    'Ten Thousand Fists (Standard Edition)',
    'Indestructible',
  ],
  Incubus: [
    '8',
    'If Not Now, When?',
    'Light Grenades',
    'A Crow Left Of The Murder',
    'Morning View',
    'Make Yourself',
  ],
  'Hiatus Kaiyote': ['Choose Your Weapon'],
  'Face To Face': ['Face to Face (Remastered)'],
  'The Offspring': [
    'Smash (2008 Remaster)',
    'Ixnay On The Hombre',
    'Americana',
    'Conspiracy Of One',
  ],
  'Porcupine Tree': ['The Incident'],
  'Snarky Puppy': ['Culcha Vulcha', 'We Like It Here'],
  Pendulum: ['Immersion'],
  'Foo Fighters': [
    'Foo Fighters',
    'The Colour And The Shape (Expanded Edition)',
    'There Is Nothing Left To Lose',
    'One By One (Expanded Edition)',
    'In Your Honor',
  ],
};
const artistsWithAlbumBlacklist = {
  Thrice: ['Anthology', 'Live At The House of Blues'],
  Alexisonfire: ['Live At Copps'],
  'System Of A Down': [
    'System Of A Down/Steal This Album',
    'System Of A Down (Bonus Pack)',
  ],
};

const allKnownArtists = aristsWhoDoNotGetFiltered
  .concat(bannedArtists)
  .concat(Object.keys(artistsWithAlbumWhitelist))
  .concat(Object.keys(artistsWithAlbumBlacklist));

const checkForUnknownArtists = artists => {
  artists
    .filter(artist => !allKnownArtists.includes(artist.name))
    .forEach(artist => {
      logger.log(
        `!!!!!!!!!!!!!!!! Warning! Uncategorised artist: ${
          artist.name
        } !!!!!!!!!!!!!!!!`,
      );
    });
};

module.exports = {
  bannedArtists,
  artistsWithAlbumWhitelist,
  artistsWithAlbumBlacklist,
  checkForUnknownArtists,
};
