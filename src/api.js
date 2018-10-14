const url = require('url');
const requestPromise = require('request-promise');
const sleep = require('./sleep');

const baseUrl = 'https://api.spotify.com';

module.exports = auth => {
  const request = requestPromise.defaults({
    json: true,
    headers: {
      Accept: '*/*',
      Authorization: auth,
    },
  });
  const get = path => request.get({ uri: `${baseUrl}${path}` });

  const getSlowly = (uris, time) =>
    uris.reduce(
      (promise, uri) =>
        promise.then(accumulator =>
          sleep(time)
            .then(() => get(uri))
            .then(result => accumulator.concat(result)),
        ),
      Promise.resolve([]),
    );

  const getAll = (path, entityType) => {
    let result = [];

    const accumulate = response => {
      result = result.concat(response[entityType].items);

      const next = response[entityType].next;
      if (next) {
        const nextPath = url.parse(next).path;
        return get(nextPath).then(accumulate);
      }
      return result;
    };

    return get(path).then(accumulate);
  };

  const post = (path, body) => request.post({ uri: `${baseUrl}${path}`, body });

  const postAll = (path, bodies) =>
    bodies.reduce(
      (promise, body) => promise.then(() => post(path, body)),
      Promise.resolve(),
    );

  return {
    get,
    getSlowly,
    getAll,
    post,
    postAll,
  };
};
