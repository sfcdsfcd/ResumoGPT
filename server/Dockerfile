FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json tsconfig.json ./
RUN npm install
COPY . ./
RUN npm run build && npm prune --production
CMD ["npm", "start"]
