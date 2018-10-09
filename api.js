const requestPromise = require('request-promise');

const baseUrl = 'https://api.spotify.com/v1';
const sleep = time => new Promise(resolve => setTimeout(resolve, time));

module.exports = auth => {
  const request = requestPromise.defaults({
    json: true,
    headers: {
      Accept: '*/*',
      Authorization: auth,
    },
  });
  const get = uri => request.get({ uri: `${baseUrl}${uri}` });

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

  const getAll = (uri, entityType) => {
    let result = [];

    const accumulate = response => {
      result = result.concat(response[entityType].items);

      const next = response[entityType].next;
      if (next) {
        return get(next).then(accumulate);
      }
      return result;
    };

    return get(uri).then(accumulate);
  };

  const post = (uri, body) => request.post({ uri: `${baseUrl}${uri}`, body });

  const postAll = (uri, bodies) =>
    bodies.reduce(
      (promise, body) => promise.then(() => post(uri, body)),
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
