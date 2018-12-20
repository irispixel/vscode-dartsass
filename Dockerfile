# docker build --build-arg NODE_VERSION=${NODE_VERSION} -t vscode-quiksass:${NODE_VERSION} .
# docker build -t vscode-quiksass:8.14.0-alpine .

# https://hub.docker.com/_/node?tab=tags
ARG NODE_VERSION=8.14.0-alpine
ARG VSCE_VERSION=1.54.0
FROM node:${NODE_VERSION}

RUN node --version
RUN npm --version
RUN npm install -g npm@5.5.1

RUN echo "vsce @ 1.54.0"
RUN npm install -g vsce@${VSCE_VERSION}

ARG DEVEL_USER=develop
RUN cat /etc/os-release
RUN adduser -g "" -D  ${DEVEL_USER}

RUN adduser ${DEVEL_USER} node
RUN id ${DEVEL_USER}

USER ${DEVEL_USER}
WORKDIR /home/${DEVEL_USER}

RUN vsce --version
RUN npm --version

WORKDIR /tmp

ENTRYPOINT /bin/sh -c "while true; do echo hello; sleep 100; done"
