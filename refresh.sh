#!/bin/sh
set -e

yarn getTrackData
node filterTracks.js
yarn createPlaylist
