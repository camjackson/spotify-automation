const getArtistsAlbums = async ({ get }, artists) => {
  const allArtistsAllAlbums = await Promise.all(
    artists.map(artist =>
      get(
        `/v1/artists/${
          artist.id
        }/albums?limit=50&include_groups=album,single,compilation`,
      ),
    ),
  );
  const albums = allArtistsAllAlbums.reduce(
    (result, artistAlbums) => result.concat(artistAlbums.items),
    [],
  );

  return albums;
};

module.exports = getArtistsAlbums;
