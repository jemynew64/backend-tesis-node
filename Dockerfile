FROM node:20-alpine AS development

# Instalar PostgreSQL client (esto es necesario para usar pg_isready)
RUN apk add --no-cache postgresql-client

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Copia todos los archivos, incluyendo el schema.prisma
COPY . .

RUN npm run build

FROM node:20-alpine  AS production

ARG NODE_ENV=production 
ENV NODE_ENV=${NODE_ENV}

# Instalar PostgreSQL client (esto es necesario para usar pg_isready)
RUN apk add --no-cache postgresql-client

WORKDIR /usr/src/app

COPY package*.json .

RUN npm ci --only=production
# Copiar la carpeta dist y prisma desde el contenedor de desarrollo
COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/prisma ./prisma

CMD [ "node", "dist/server.js" ]