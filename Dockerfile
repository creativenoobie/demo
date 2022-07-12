FROM node:16-alpine

WORKDIR /app

COPY . /app

RUN yarn && yarn build

EXPOSE 3000

CMD ["yarn", "start:prod"]
