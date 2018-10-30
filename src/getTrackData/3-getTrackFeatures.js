const { chunkify, indexBy, flatten } = require('../arrayUtils');

const getTrackFeatures = async ({ getSlowly }, tracks) => {
  const trackFeaturesUrls = chunkify(tracks, 100, track => track.id).map(
    trackIds => `/v1/audio-features?ids=${trackIds.join(',')}`,
  );

  const trackFeatures = flatten(
    await getSlowly(trackFeaturesUrls),
    'audio_features',
  );
  const trackMap = indexBy(tracks, 'id');

  return trackFeatures.filter(track => !!track).map(track =>
    Object.assign(track, {
      name: trackMap[track.id].name,
      artists: trackMap[track.id].artists.map(artist => artist.name),
      album: trackMap[track.id].album,
    }),
  );
};

module.exports = getTrackFeatures;
