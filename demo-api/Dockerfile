# NB we expect the repo root to be the build context

FROM node:14-alpine3.12 AS build-ayla-client

WORKDIR /usr/src/ayla-client

COPY ayla-client/package.json ayla-client/yarn.lock ./

RUN yarn install --frozen-lockfile

COPY ayla-client/tsconfig.json ./
COPY ayla-client/src ./src

RUN yarn build-ts

FROM node:14-alpine3.12 AS build

WORKDIR /usr/src/demo-api

COPY --from=build-ayla-client /usr/src/ayla-client/package.json /usr/src/ayla-client/dist /usr/src/ayla-client/

COPY demo-api/package.json demo-api/yarn.lock ./

RUN yarn install --frozen-lockfile

COPY demo-api/tsconfig.json ./
COPY demo-api/src ./src

RUN yarn build-ts

FROM node:14-alpine3.12
ENV NODE_ENV=production

RUN apk --no-cache add curl

WORKDIR /usr/src/demo-api

RUN chown node:node .

COPY demo-api/entrypoint ./entrypoint
RUN chown node:node ./entrypoint
RUN chmod u+x ./entrypoint

USER node

COPY --from=build-ayla-client /usr/src/ayla-client/package.json /usr/src/ayla-client/dist /usr/src/ayla-client/

COPY demo-api/package.json demo-api/yarn.lock ./

RUN yarn install --frozen-lockfile

COPY ./graph ../graph
COPY --from=build /usr/src/demo-api/dist ./dist

EXPOSE 3000

ENTRYPOINT [ "./entrypoint" ]
CMD ["node", "dist/index.js"]