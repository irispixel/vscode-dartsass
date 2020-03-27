# docker build -t vscode-plugin-dartsass:12.14.1-alpine3.11 .

# https://hub.docker.com/_/node?tab=tags
ARG NODE_VERSION=12.14.1-alpine3.11
FROM node:${NODE_VERSION}
RUN apk add python make g++ && \
    node --version && \
    npm --version
RUN echo "npm updated on Mar 25 2020" && \
    npm install -g npm
ENV VSCE_VERSION=1.74.0
RUN echo "vsce @ ${VSCE_VERSION}" && \
    npm install -g vsce@${VSCE_VERSION}

ARG DEVEL_USER=develop
RUN cat /etc/os-release && \
    adduser -g "" -D  ${DEVEL_USER} && \
    adduser ${DEVEL_USER} node && \
    id ${DEVEL_USER}

# The version of sass 1.19.0 has no significance except that it is not the
# latest version of sass
# ( see package.json to confirm the latest version of sass ).
# This binary inside the container image is used
# primarily for testing purposes only.
ARG SASS_VERSION=1.19.0
RUN npm install -g sass@1.19.0

USER ${DEVEL_USER}
WORKDIR /home/${DEVEL_USER}

RUN vsce --version && npm --version

WORKDIR /tmp

ENTRYPOINT /bin/sh -c "while true; do echo hello; sleep 100; done"
# docker-compose up --force-recreate -d --remove-orphans