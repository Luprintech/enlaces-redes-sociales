#!/bin/sh
set -eu

mkdir -p /app/data
mkdir -p /app/public/uploads
mkdir -p /app/backups

exec node dist-server/server/index.js
