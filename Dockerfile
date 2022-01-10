FROM nginx:latest
LABEL maintainer "luffybryant@gmail.com"
COPY ./dist/ /usr/share/nginx/html/lottery
EXPOSE 80