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
  let fsWrite;

  beforeEach(() => {
    Object.assign(originalFilters, filters);

    filters.bannedArtists = ['Solar Fields'];
    filters.artistsWithAlbumWhitelist = {
      Cog: ['The New Normal'],
    };
    filters.artistsWithAlbumBlacklist = {
      Thrice: ['Vheissu'],
    };

    fsWrite = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
  });

  afterEach(() => {
    Object.assign(filters, originalFilters);
    fsWrite.mockRestore();
  });

  it('works from end to end', async () => {
    const authServer = nock(urls.accounts)
      .post(urls.token, body => body.code === 'SOME_CODE')
      .reply(200, responses.token);

    const apiServer = nock(urls.apiBase)
      // .log(console.log)
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

    await runCommand(getTrackData, false);

    authServer.done();
    apiServer.done();

    // Doing these assertions by hand because the last one will cause Jest to
    // hang while logging if the diff b/w expected and actual is too huge.
    const [token, features] = fsWrite.mock.calls;
    expect(token[0]).toEqual('./data/token.json');
    expect(token[1]).toEqual('{"token":"Bearer SOME_TOKEN"}');
    expect(features[0]).toEqual('./data/trackFeatures.json');
    expect(features[1] === JSON.stringify(finalTrackData, null, 2)).toEqual(
      true,
    );
  });
});
