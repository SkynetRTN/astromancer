#!/bin/bash
# docker-shell.sh
# Finds the running container ID dynamically
CONTAINER_ID=$(docker ps -qf "name=astromancer-sandbox")

if [ -z "$CONTAINER_ID" ]; then
  echo "⚠️ Container not running! Starting it..."
  docker-compose up -d
  CONTAINER_ID=$(docker ps -qf "name=astromancer-sandbox")
fi

# Drops the user (or Agent) directly into the container
# Use -t only if input is a terminal
if [ -t 0 ]; then
    FLAGS="-it"
else
    FLAGS="-i"
fi
docker exec $FLAGS "$CONTAINER_ID" /bin/sh "$@"