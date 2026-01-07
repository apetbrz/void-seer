#!/usr/bin/env bash

read -p "This will shut down and delete the existing container, okay? [y/N] " conf
[ "${conf,,}" = "y" ] || exit

echo -n "Shutting down existing container: "
docker -v kill fissures-app-new
echo -n "Deleting existing container: "
docker -v rm fissures-app-new
echo "[Building latest version]"
docker build -t fissures-app-new .
echo "
[Starting latest version]"
docker run --name 'fissures-app-new' -p '4001:4001' -d fissures-app-new:latest
