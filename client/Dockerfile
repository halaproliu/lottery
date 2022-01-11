FROM node:latest
LABEL maintainer "luffybryant@gmail.com"
RUN mkdir -p /webapp
WORKDIR /webapp
COPY ./client .
RUN npm config set registry https://registry.npm.taobao.org
RUN npm i
CMD npm start
EXPOSE 80