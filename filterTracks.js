const fs = require('fs');
const tracks = require('./trackFeatures');

const maxAcousticness = 0.9;
const minTempo = 160;
const maxTempo = 200;
const minDuration = 30000;

console.log(`Filtering ${tracks.length} tracks`);
const filtered = tracks.filter(track => (
  track.acousticness <= maxAcousticness &&
  track.tempo >= minTempo &&
  track.tempo <= maxTempo &&
  track.duration_ms >= minDuration
));

console.log(`Reduced down to ${filtered.length} tracks`);
fs.writeFileSync('filtered.json', JSON.stringify(filtered, null, 2));
