# Spotify automation

1. Clone the repo: `git clone git@github.com:camjackson/spotify-automation`
2. Install the dependencies: `yarn`
3. Initialise some empty data files: `yarn setup`
4. Log in to https://beta.developer.spotify.com/dashboard/, and create a `src/creds.js` that exports an object with `clientId` and `clientSecret`.
5. Download the track data: `yarn getTrackData`
6. (Optional) Adjust artist/album filters in: `src/getTrackData/filters.js`
7. (Optional) Adjust feature thresholds in: `src/getTrackData/4-filterTracks.js`
8. `yarn createPlaylist`

Once you have the creds and filters set up how you want them, create a fresh playlist in one step:

```sh
./refresh.sh
```
