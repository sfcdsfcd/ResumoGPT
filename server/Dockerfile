FROM node:18-alpine

WORKDIR /app

COPY package*.json tsconfig.json ./

# Instala dependências com suporte à build nativa
RUN apk add --no-cache --virtual .build-deps \
    python3 make g++ && \
    npm install && \
    apk del .build-deps

COPY . .

RUN npm run build

CMD ["npm", "run", "debug"]
