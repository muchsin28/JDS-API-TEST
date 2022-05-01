FROM node:lts-alpine

WORKDIR /app

COPY . .

RUN npm install

ENV APP_VERSION=1.0
ENV PORT=3000
ENV FILE_NAME=jds-user
ENV SECRET=rahasianegara
ENV TOKEN_EXPIRE_IN_HOUR=1

CMD ["node", "app.js"]