# Spotify automation

1. Clone the repo: `git clone git@github.com:camjackson/spotify-automation`
2. Install the dependencies: `yarn`
3. Log in to https://beta.developer.spotify.com/dashboard/, and create a `src/creds.js` that exports an object with `clientId` and `clientSecret`.
4. Download the track data: `yarn start getTrackData`
5. TODO: Update these instructions
6. (Optional) Sort tracks for manual analysis: `node src/sortTracks.js`
7. (Optional) Adjust filters to your liking in `src/filterTracks.js`
8. `node src/filterTracks.js`
9. `yarn start createPlaylist`

Once you have the creds and filters set up how you want them, create a fresh playlist in one step:

```sh
./refresh.sh
```
