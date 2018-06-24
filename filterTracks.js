const fs = require('fs');
const { arraysEqual } = require('./arrayUtils');
const tracks = require('./trackFeatures');

const maxAcousticness = 0.9;
const minTempo = 160;
const maxTempo = 200;
const minDuration = 30000;
const maxLiveness = 0.8;

console.log(`Filtering ${tracks.length} tracks`);
const filtered = tracks.filter(track => (
  track.acousticness <= maxAcousticness &&
  track.tempo >= minTempo &&
  track.tempo <= maxTempo &&
  track.duration_ms >= minDuration &&
  track.liveness <= maxLiveness
));

console.log(`Reduced down to ${filtered.length} tracks`);

console.log(`De-duping ${filtered.length} tracks`);
const compareTracks = first => second => (
  first.name === second.name && arraysEqual(first.artists, second.artists)
);
const uniqueTracks = filtered.filter((track, index) => (
  filtered.findIndex(compareTracks(track)) === index
));
console.log(`Reduced down to ${uniqueTracks.length} tracks`);

fs.writeFileSync('filtered.json', JSON.stringify(uniqueTracks, null, 2));
