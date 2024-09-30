FROM node:20

# Make volumes be owned by the node user
RUN mkdir /home/node/.ssh
RUN chown node:node /home/node/.ssh
RUN mkdir /data
RUN chown node:node /data

USER node

WORKDIR /home/node/app

# Dependencies
COPY .npmrc .
COPY package.json .
COPY package-lock.json .
RUN npm ci

# Configuration
COPY vite.config.ts .
COPY svelte.config.js .
COPY tsconfig.json .

# Source code
COPY src src
COPY static static

RUN ls -al /home/node/app

# Build server
RUN npm run build

EXPOSE 3000

ENTRYPOINT [ "node", "-r", "dotenv/config", "build" ]
