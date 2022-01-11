#!/bin/bash
networkName=$1
outerPort=3001
innerPort=3001
docker build -t server -f Dockerfile.node .
docker run -d --network $networkName -p $outerPort:$innerPort --restart always server
