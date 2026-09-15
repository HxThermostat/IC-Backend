# NB we expect the repo root to be the build context

FROM node:14-bullseye AS build-ayla-client

WORKDIR /usr/src/ayla-client

COPY ayla-client/package.json ayla-client/yarn.lock ./

RUN yarn install --frozen-lockfile

COPY ayla-client/tsconfig.json ./
COPY ayla-client/src ./src

RUN yarn build-ts

FROM node:14-bullseye AS build

WORKDIR /usr/src/intellicomfort-api

COPY --from=build-ayla-client /usr/src/ayla-client/package.json /usr/src/ayla-client/dist /usr/src/ayla-client/

COPY intellicomfort-api/package.json intellicomfort-api/yarn.lock ./

RUN yarn install --frozen-lockfile

COPY intellicomfort-api/tsconfig.json ./
COPY intellicomfort-api/src ./src

RUN yarn build-ts

FROM node:14-bullseye

# Run Datadog's Debian one-line install with a bit of Docker-specific
# cleanup to keep the image small + to give the node user access to
# the relevant config files and logs
ARG DD_API_KEY
RUN DD_AGENT_MAJOR_VERSION=7 \
    DD_API_KEY=$DD_API_KEY \
    DD_INSTALL_ONLY=true \
    DD_SITE="datadoghq.com" \
    bash -c "$(curl -L https://s3.amazonaws.com/dd-agent/scripts/install_script.sh)" && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    chown -R node:node /etc/datadog-agent/ /opt/datadog-agent/ /var/log/datadog/

# Add tini as a basic init manager
RUN apt-get update && apt-get install -y \
  tini \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

WORKDIR /usr/src/intellicomfort-api

RUN chown node:node .

USER node

COPY --from=build-ayla-client /usr/src/ayla-client/package.json /usr/src/ayla-client/dist /usr/src/ayla-client/

COPY intellicomfort-api/package.json intellicomfort-api/yarn.lock ./

RUN yarn install --frozen-lockfile

COPY ./graph ../graph
COPY --from=build /usr/src/intellicomfort-api/dist ./dist

COPY --chown=node:node --chmod=755 intellicomfort-api/entrypoint ./entrypoint

EXPOSE 3000

ENTRYPOINT [ "./entrypoint" ]
CMD ["node", "dist/index.js"]