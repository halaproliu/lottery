#!/bin/bash
networkName=$1
docker build -t server -f Dockerfile.node .
docker run -d --network $networkName -p 3001:3001 server
