# build client js
FROM node:22 AS build
WORKDIR /src
# packages
COPY ./package.json ./package-lock.json ./vite.config.ts ./tsconfig.json ./react-router.config.ts /src/
RUN npm ci
# src files
COPY ./app /src/app
RUN npm run build

# host
FROM node:22
WORKDIR /app
# packages
COPY ./package.json ./package-lock.json ./react-router.config.ts ./tsconfig.json /app/
RUN npm ci --omit=dev
# built files
COPY --from=build /src/build /app/build
COPY ./server /app/server
COPY ./secret /app/secret
COPY server.js /app/
# exec
ENV ENVIRONMENT="RELEASE"
CMD ["npm", "run", "start"]
