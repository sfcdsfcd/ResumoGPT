FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json tsconfig.json ./
RUN apk add --no-cache --virtual .build-deps \
    make g++ python3 && \
    npm install && \
    apk del .build-deps
COPY . ./
RUN npm run build && npm prune --production
CMD ["npm", "start"]
