# Spotify automation

1. Clone the repo: `git clone git@github.com:camjackson/spotify-automation`
2. Install the dependencies: `yarn`
3. Log in to https://beta.developer.spotify.com/dashboard/, and create a creds.js that exports an object with `clientId` and `clientSecret`.
4. Download the track data: `yarn start getTrackData`
5. (Optional) Sort tracks for manual analysis: `node sortTracks.js`
6. (Optional) Adjust filters to your liking in `filterTracks.js`
7. `node filterTracks.js`
