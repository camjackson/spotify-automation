const { chunkify, indexBy, flatten } = require('../arrayUtils');

const getTrackFeatures = async ({ getSlowly }, tracks, cachedTrackFeatures) => {
  const cachedIds = cachedTrackFeatures.map(track => track.id);
  const newTracks = tracks.filter(track => !cachedIds.includes(track.id));
  const newTrackMap = indexBy(newTracks, 'id');

  const trackFeaturesUrls = chunkify(newTracks, 100, track => track.id).map(
    trackIds => `/v1/audio-features?ids=${trackIds.join(',')}`,
  );

  const newTrackFeatures = flatten(
    await getSlowly(trackFeaturesUrls),
    'audio_features',
  );

  return newTrackFeatures
    .filter(track => !!track)
    .map(track =>
      Object.assign(track, {
        name: newTrackMap[track.id].name,
        artists: newTrackMap[track.id].artists.map(artist => artist.name),
        album: newTrackMap[track.id].album,
      }),
    )
    .concat(cachedTrackFeatures);
};

module.exports = getTrackFeatures;
