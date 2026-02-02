#!/bin/sh
node --import ./scss-loader.mjs ./node_modules/.bin/payload migrate --config src/payload.config.ts
exec node server.js