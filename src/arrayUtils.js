const chunkify = (array, chunkSize, elementMapper) => {
  const chunks = [];
  const numberOfChunks = Math.ceil(array.length / chunkSize);

  for (let i = 0; i < numberOfChunks; i++) {
    const chunk = array
      .slice(i * chunkSize, (i + 1) * chunkSize)
      .map(elementMapper);
    chunks.push(chunk);
  }
  return chunks;
};

const arraysEqual = (a, b) => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

const flatten = (arr, key) =>
  arr.reduce(
    (result, innerArr) =>
      key ? result.concat(innerArr[key]) : result.concat(innerArr),
    [],
  );

const indexBy = (arr, key) =>
  arr.reduce((result, obj) => Object.assign(result, { [obj[key]]: obj }), {});

module.exports = {
  chunkify,
  arraysEqual,
  flatten,
  indexBy,
};
