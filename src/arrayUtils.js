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

module.exports = {
  chunkify,
  arraysEqual,
};
