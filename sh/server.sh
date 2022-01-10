#!/bin/bash
networkName=$1
docker build -t end -f Dockerfile.node .
docker run -d --network $networkName -p 3000:3000 --restart always end