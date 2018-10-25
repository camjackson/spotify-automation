it('is not a test file', () => {});

const getId = obj => obj.id;
const artists = [
  { id: 'artist0', name: 'Thrice' },
  { id: 'artist1', name: 'Alexisonfire' },
  { id: 'artist2', name: 'Cog' },
  { id: 'artist3', name: 'Solar Fields' },
];
const artistIds = artists.map(getId);
const artistWithId = id => artists.find(artist => artist.id === id);
const albumsByArtist = {
  artist0: [
    { id: 'album0-0', name: 'The Illusion Of Safety' },
    { id: 'album0-1', name: 'The Artist In The Ambulance' },
  ],
  artist1: [{ id: 'album1-0', name: 'Crisis' }],
  artist2: [{ id: 'album2-0', name: 'The New Normal' }],
  artist3: [{ id: 'album3-0', name: 'Leaving Home' }],
};
const albumIds = artistIds.reduce(
  (result, artistId) => result.concat(albumsByArtist[artistId].map(getId)),
  [],
);
const tracksByAlbum = {
  'album0-0': [
    { id: 'track0-0-0', name: 'Deadbolt' },
    { id: 'track0-0-1', name: 'Trust' },
  ],
  'album0-1': [
    { id: 'track0-1-0', name: "All That's Left" },
    { id: 'track0-1-1', name: 'The Melting Point Of Wax' },
  ],
  'album1-0': [
    { id: 'track1-0-0', name: 'This Could Be Anywhere In The World' },
    { id: 'track1-0-1', name: 'Boiled Frogs' },
  ],
  'album2-0': [
    { id: 'track2-0-0', name: 'Real Life' },
    { id: 'track2-0-1', name: 'Run' },
  ],
  'album3-0': [{ id: 'track3-0-0', name: 'Star Fruit' }],
};
const trackIds = albumIds.reduce(
  (result, albumId) => result.concat(tracksByAlbum[albumId].map(getId)),
  [],
);

const trackFeatures = [
  { id: 'track0-0-0', boltiness: 1 },
  { id: 'track0-0-1', trustworthiness: 1 },
  { id: 'track0-1-0', amountLeft: 0 },
  { id: 'track0-1-1', meltingPoint: 0 },
  { id: 'track1-0-0', locationCertainty: 0 },
  { id: 'track1-0-1', frogTemperature: 99 },
  { id: 'track2-0-0', thoughts: -1 },
  { id: 'track2-0-1', speed: 1 },
];

const urls = {
  accounts: 'https://accounts.spotify.com',
  token: '/api/token',
  apiBase: 'https://api.spotify.com',
  getMyArtists: '/v1/me/following?type=artist&limit=50',
  getArtistAlbums: artistId =>
    `/v1/artists/${artistId}/albums?limit=50&include_groups=album,single,compilation`,
  getAlbums: `/v1/albums?ids=album0-0,album0-1,album1-0,album2-0`,
  getTrackFeatures: `/v1/audio-features?ids=${trackIds.join(',')}`,
};

const myArtists0 = {
  artists: {
    items: artists.slice(0, 2),
    next: `${urls.getMyArtists}&page=2`,
  },
};
const myArtists1 = {
  artists: {
    items: artists.slice(2),
  },
};
const idOnly = entity => ({ id: entity.id });
const artistAlbums = artistIds.reduce(
  (result, artistId) => ({
    ...result,
    [artistId]: {
      items: albumsByArtist[artistId].map(idOnly),
    },
  }),
  {},
);
const addArtist = name => track => ({ ...track, artists: [{ name }] });
const albumDetails = {
  albums: artistIds.reduce(
    (result, artistId) =>
      result.concat(
        albumsByArtist[artistId].map(album => ({
          ...album,
          tracks: {
            items: tracksByAlbum[album.id].map(
              addArtist(artistWithId(artistId).name),
            ),
          },
        })),
      ),
    [],
  ),
};

const responses = {
  token: { access_token: 'SOME_TOKEN' },
  myArtists0,
  myArtists1,
  artistAlbums,
  albumDetails,
  trackFeatures: { audio_features: trackFeatures },
};

module.exports = {
  urls,
  responses,
  artistIds,
};
