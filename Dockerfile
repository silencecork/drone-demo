FROM node:10.15

RUN mkdir data

WORKDIR data

ADD *.js ./
ADD package.json ./
ADD test/ ./

RUN npm install

CMD ["node", "index.js"]