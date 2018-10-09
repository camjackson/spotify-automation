const fs = require('fs');
const { arraysEqual } = require('./arrayUtils');
const tracks = require('./trackFeatures');

const maxAcousticness = 0.9;
const minTempo = 160;
const maxTempo = 200;
const minDuration = 30000;
const maxLiveness = 0.8;
const maxInstrumentalness = 0.5;

const artistsWhitelistedAlbums = {
  Pendulum: ['Immersion'],
};

const passesAlbumWhitelist = track => {
  const matchingArtists = track.artists.filter(
    artist => artistsWhitelistedAlbums[artist],
  );
  if (matchingArtists.length === 0) {
    // None of this track's artists appear in the list above
    return true;
  }

  for (let i = 0; i < matchingArtists.length; i++) {
    if (artistsWhitelistedAlbums[matchingArtists[i]].includes(track.album)) {
      // The track's album is in the whitelist
      return true;
    }
  }
  // The artist is above, but the album isn't in the whitelist
  return false;
};

const artistBlacklistedAlbums = {
  Thrice: ['Anthology', 'Live At The House of Blues'],
  Incubus: [
    'Live In Sweden 2004',
    'Live in Japan 2004',
    'Live',
    'Live in Malaysia 2004',
  ],
  Alexisonfire: ['Live At Copps'],
};

const passesAlbumBlacklist = track => {
  for (let i = 0; i < track.artists.length; i++) {
    const blacklistAlbums = artistBlacklistedAlbums[track.artists[i]];
    if (blacklistAlbums && blacklistAlbums.includes(track.album)) {
      console.log('Blacklisted:', track.artists, track.album, track.name);
      return false;
    }
  }
  return true;
};

console.log(`Filtering ${tracks.length} tracks`);
const filtered = tracks.filter(
  track =>
    track.acousticness <= maxAcousticness &&
    track.tempo >= minTempo &&
    track.tempo <= maxTempo &&
    track.duration_ms >= minDuration &&
    track.liveness <= maxLiveness &&
    track.instrumentalness <= maxInstrumentalness &&
    passesAlbumWhitelist(track) &&
    passesAlbumBlacklist(track),
);

console.log(`Reduced down to ${filtered.length} tracks`);

console.log(`De-duping ${filtered.length} tracks`);
const compareTracks = first => second =>
  first.name.toLowerCase() === second.name.toLowerCase() &&
  arraysEqual(first.artists, second.artists);
const uniqueTracks = filtered.filter(
  (track, index) => filtered.findIndex(compareTracks(track)) === index,
);
console.log(`Reduced down to ${uniqueTracks.length} tracks`);

fs.writeFileSync('filtered.json', JSON.stringify(uniqueTracks, null, 2));
