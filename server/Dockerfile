FROM node:18-alpine AS build


WORKDIR /usr/src/app


COPY package.json ./


RUN npm install --frozen-lockfile --prod


COPY . .


EXPOSE 3000


CMD ["node", "app.js"]