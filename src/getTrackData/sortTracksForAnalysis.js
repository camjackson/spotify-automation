const fs = require('fs');

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

const sortTracksForAnalysis = tracks => {
  interestingFeatures.forEach(feature => {
    const sorted = tracks
      .sort((a, b) => a[feature] - b[feature])
      .map(track => ({
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
  });
};

module.exports = sortTracksForAnalysis;
