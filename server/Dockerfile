FROM node:15.14-alpine
LABEL maintainer "luffybryant@gmail.com"
# RUN apk update && apk add bash
# SHELL ["/bin/bash", "-o", "pipefail", "-c"]
ARG dir=/home/koa/lottery
ARG registry=https://registry.npm.taobao.org
RUN mkdir -p ${dir}
WORKDIR ${dir}
# RUN/COPY是分层的, package.json 提前, 只要没修改就不会重新安装包（优化二）
COPY server/package.json ${dir}/package.json
COPY server/package-lock.json ${dir}/package-lock.json
RUN npm config set registry ${registry}
# 生产环境不打包devDependencies（优化三）
RUN npm i --production
COPY ./server ${dir}
RUN npm run build
# RUN yarn --ignore-scripts
# RUN yarn global add pm2
RUN npm i -g pm2
EXPOSE 3001
CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]
# CMD ["npm", "start"]