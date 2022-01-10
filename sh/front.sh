#!/bin/bash
networkName=$1
# 创建前端页面镜像
docker build -t front .
# 创建前端页面容器
docker run -d --network $networkName -p 80:80 -v ~/conf.d:/etc/nginx/conf.d front