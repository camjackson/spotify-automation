const fs = require('fs');
const logger = require('./logger');
const tracks = require('../data/trackFeatures.json');

const interestingFeatures = [
  'acousticness',
  'danceability',
  'energy',
  'instrumentalness',
  'liveness',
  'speechiness',
  'tempo',
  'valence',
];

interestingFeatures.forEach(feature => {
  logger.log(`Sorting by ${feature}`);
  const sorted = tracks.sort((a, b) => a[feature] - b[feature]).map(track => ({
    id: track.id,
    name: track.name,
    artists: track.artists,
    album: track.album,
    [feature]: track[feature],
  }));
  fs.writeFileSync(
    `./data/sortedBy/${feature}.json`,
    JSON.stringify(sorted, null, 2),
  );
  logger.log(`Wrote sorted tracks to ./sortedBy/${feature}.json`);
});

logger.log('Done!');
