#!/usr/bin/env bash

read -p "This will shut down and delete the existing container, okay? [y/N] " conf
[ "${conf,,}" = "y" ] || exit

echo -n "Shutting down existing container: "
docker -v kill void-seer
echo -n "Deleting existing container: "
docker -v rm void-seer
echo "[Building latest version]"
docker build -t void-seer .
echo "
[Starting latest version]"
docker run --name 'void-seer' -p '4001:4001' -d void-seer:latest
