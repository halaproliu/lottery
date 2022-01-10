#!/bin/bash
# 停止所有镜像
docker stop $(docker ps -aq)
# 删除所有容器
docker rm $(docker ps -aq)
# 删除所有镜像
docker rmi $(docker images -q)
# 创建一个应用network
docker network create lottery
source sh/front.sh lottery
source sh/server.sh lottery