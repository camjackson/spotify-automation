jest.mock('opn', () => uri => {
  /* eslint-disable global-require */
  const url = require('url');
  const request = require('request');
  /* eslint-enable global-require */
  const query = url.parse(uri).query;
  const callbackUrl = query.match('redirect_uri=(.*)')[1];

  request.get({ uri: `${callbackUrl}?code=SOME_CODE` });
});
jest.mock('../sleep', () => () => Promise.resolve());

const fs = require('fs');
const nock = require('nock');
const data = require('./testData');
const runCommand = require('../runCommand');
const getTrackData = require('../getTrackData');
const filters = require('../getTrackData/filters');
const finalTrackData = require('./finalTrackData.json');

const { urls, responses } = data;

describe('journey test', () => {
  const originalFilters = {};

  beforeEach(() => {
    Object.assign(originalFilters, filters);

    filters.bannedArtists = ['Solar Fields'];
    filters.artistsWithAlbumWhitelist = {
      Cog: ['The New Normal'],
    };
    filters.artistsWithAlbumBlacklist = {
      Thrice: ['Vheissu'],
    };
  });

  afterEach(() => {
    Object.assign(filters, originalFilters);
  });

  it('works from end to end', async () => {
    const fsWrite = jest
      .spyOn(fs, 'writeFileSync')
      .mockImplementation(() => {});

    const authServer = nock(urls.accounts)
      .post(urls.token, body => body.code === 'SOME_CODE')
      .reply(200, responses.token);

    const apiServer = nock(urls.apiBase)
      // Requesting own followed artists:
      .get(urls.getMyArtists)
      .reply(200, responses.myArtists0)
      .get(`${urls.getMyArtists}&page=2`)
      .reply(200, responses.myArtists1)

      // Requesting albums of each artist:
      .get(urls.getArtistAlbums(data.artistIds[0]))
      .reply(200, responses.artistAlbums.artist0)
      .get(urls.getArtistAlbums(data.artistIds[1]))
      .reply(200, responses.artistAlbums.artist1)
      .get(urls.getArtistAlbums(data.artistIds[2]))
      .reply(200, responses.artistAlbums.artist2)

      // Requesting tracks of all albums:
      .get(urls.getAlbums)
      .reply(200, responses.albumDetails)

      // Requesting audio features of all tracks:
      .get(urls.getTrackFeatures)
      .reply(200, responses.trackFeatures);

    await runCommand(getTrackData);

    authServer.done();
    apiServer.done();

    expect(fsWrite).toHaveBeenCalledWith(
      './data/trackFeatures.json',
      JSON.stringify(finalTrackData, null, 2),
    );

    fsWrite.mockRestore();
  });
});
