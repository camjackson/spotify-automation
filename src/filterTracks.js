const fs = require('fs');
const logger = require('./logger');
const { arraysEqual } = require('./arrayUtils');
const tracks = require('../data/trackFeatures.json');

const maxAcousticness = 0.9;
const minTempo = 160;
const maxTempo = 200;
const minDuration = 30000;
const maxLiveness = 0.8;
const maxInstrumentalness = 0.5;

logger.log(`Filtering ${tracks.length} tracks`);
const filtered = tracks.filter(
  track =>
    track.acousticness <= maxAcousticness &&
    track.tempo >= minTempo &&
    track.tempo <= maxTempo &&
    track.duration_ms >= minDuration &&
    track.liveness <= maxLiveness &&
    track.instrumentalness <= maxInstrumentalness,
);

logger.log(`Reduced down to ${filtered.length} tracks`);

logger.log(`De-duping ${filtered.length} tracks`);
const compareTracks = first => second =>
  first.name.toLowerCase() === second.name.toLowerCase() &&
  arraysEqual(first.artists, second.artists);
const uniqueTracks = filtered.filter(
  (track, index) => filtered.findIndex(compareTracks(track)) === index,
);
logger.log(`Reduced down to ${uniqueTracks.length} tracks`);

fs.writeFileSync('./data/filtered.json', JSON.stringify(uniqueTracks, null, 2));
