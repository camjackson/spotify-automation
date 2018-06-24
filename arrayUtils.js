const chunkify = (array, chunkSize, elementMapper) => {
  const chunks = [];
  const numberOfChunks = Math.ceil(array.length / chunkSize);

  for (let i = 0; i < numberOfChunks; i++) {
    const chunk = array.slice(i * chunkSize, (i + 1) * chunkSize).map(elementMapper);
    chunks.push(chunk);
  }
  return chunks;
};

module.exports = {
  chunkify,
};
