# docker build -t dartsass-plugin-common:12.14.1-alpine3.11 .

# https://hub.docker.com/_/node?tab=tags
ARG NODE_VERSION=12.14.1-alpine3.11
FROM node:${NODE_VERSION}
RUN apk add python make g++
    
RUN echo "Updated on Feb 3 2020" && \
    node --version && npm --version && \
    npm install -g npm
    
ARG DEVEL_USER=develop
ARG TYPESCRIPT_VERSION=3.7.5

# The version of sass 1.19.0 has no significance except that it is not the
# latest version of sass
# ( see package.json to confirm the latest version of sass ).
# This binary inside the container image is used
# primarily for testing purposes only.
ARG SASS_VERSION=1.19.0
RUN npm install -g sass@1.19.0 && \
    npm install -g typescript@${TYPESCRIPT_VERSION} && \
    cat /etc/os-release && \
    adduser -g "" -D  ${DEVEL_USER} &&  \
    adduser ${DEVEL_USER} node && \
    id ${DEVEL_USER}

USER ${DEVEL_USER}
WORKDIR /home/${DEVEL_USER}

RUN npm --version && tsc --version && sass --version

WORKDIR /tmp

ENTRYPOINT /bin/sh -c "while true; do echo hello; sleep 100; done"
# docker-compose up --force-recreate -d --remove-orphans