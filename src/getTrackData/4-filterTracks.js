const { arraysEqual } = require('../util/arrayUtils');

const maxAcousticness = 0.9;
const minTempo = 160;
const maxTempo = 200;
const minDuration = 30000;
const maxLiveness = 0.8;
const maxInstrumentalness = 0.5;

const filterTracks = tracks => {
  const filtered = tracks.filter(
    track =>
      track.acousticness <= maxAcousticness &&
      track.tempo >= minTempo &&
      track.tempo <= maxTempo &&
      track.duration_ms >= minDuration &&
      track.liveness <= maxLiveness &&
      track.instrumentalness <= maxInstrumentalness,
  );

  const compareTracks = first => second =>
    first.name.toLowerCase() === second.name.toLowerCase() &&
    arraysEqual(first.artists, second.artists);

  const uniqueTracks = filtered.filter(
    (track, index) => filtered.findIndex(compareTracks(track)) === index,
  );

  return uniqueTracks;
};

module.exports = filterTracks;
