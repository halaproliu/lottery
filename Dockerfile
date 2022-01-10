FROM nginx:latest
LABEL maintainer "luffybryant@gmail.com"
COPY ./client/build/ /usr/share/nginx/html/lottery
COPY ./nginx/nginx.conf /etc/nginx
EXPOSE 80