FROM node:22-alpine

WORKDIR /app

COPY package.json .
COPY . .

RUN npm ci
RUN npm rebuild esbuild

RUN npm i -g serve

RUN npm run build

EXPOSE 3000

CMD [ "serve", "-s", "dist" ]