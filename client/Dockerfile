FROM node:18-alpine

WORKDIR /app2

COPY package.json /app2

RUN npm install

COPY . /app2

EXPOSE 5173

CMD [ "npm","run","dev" ]