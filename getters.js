const request = require('request-promise');

const sleep = time => new Promise(resolve => setTimeout(resolve, time));

module.exports = (auth) => {
  const options = {
    json: true,
    headers: {
      'Accept': '*/*',
      'Authorization': auth,
    },
  };
  const get = uri => request(Object.assign({}, options, { uri, method: 'GET' }));

  const getSlowly = (uris, time) => (
    uris.reduce((promise, uri) => (
      promise.then(accumulator => (
        sleep(time)
          .then(() => get(uri))
          .then(result => accumulator.concat(result))
      ))
    ), Promise.resolve([]))
  );

  const getAll = (uri, entityType) => {
    let promise;
    let result = [];

    const accumulate = response => {
      result = result.concat(response[entityType].items);

      const next = response[entityType].next;
      if (next) {
        return get(next).then(accumulate);
      }
      return result;
    };

    promise = get(uri).then(accumulate);
    return promise;
  };

  return { get, getSlowly, getAll }
}
