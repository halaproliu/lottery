#!/bin/bash
networkName=$1
outerPort=80
innerPort=80
# 创建前端页面镜像
docker build -t front .
# 创建前端页面容器
docker run -d --network $networkName -p $outerPort:$innerPort -v ~/conf.d:/etc/nginx/conf.d front