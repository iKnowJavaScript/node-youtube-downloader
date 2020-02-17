FROM node:10.16.3-alpine
RUN mkdir -p /opt/downloader
EXPOSE 3500
WORKDIR /opt/downloader
ADD package.json /opt/downloader
ADD . /opt/downloader/
CMD ["npm", "start"]

