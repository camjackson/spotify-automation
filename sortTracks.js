const fs = require('fs');
const tracks = require('./trackFeatures');

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
  console.log(`Sorting by ${feature}`);
  const sorted = tracks.sort((a, b) =>  a[feature] - b[feature]);
  fs.writeFileSync(`./sortedBy/${feature}.json`, JSON.stringify(sorted, null, 2));
  console.log(`Wrote sorted tracks to ./sortedBy/${feature}.json`);
});

console.log('Done!');