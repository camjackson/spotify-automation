#!/bin/sh
set -e

yarn getTrackData
node src/filterTracks.js
yarn createPlaylist
