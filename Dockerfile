FROM node:18-alpine
WORKDIR /usr/src/
COPY package.json ./
COPY yarn.lock ./
COPY . .
RUN yarn
RUN yarn build
CMD ["yarn", "start:prod"]