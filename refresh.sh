#!/bin/sh
set -e

yarn start getTrackData
node filterTracks.js
yarn start createPlaylist
