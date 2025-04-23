# ------------------------------
# Etapa 1: Desarrollo y Build
# ------------------------------
    FROM node:20-alpine AS build

    RUN apk add --no-cache postgresql-client curl
    
    WORKDIR /usr/src/app
    
    COPY package*.json ./
    RUN npm install
    
    COPY . .
    RUN npm run build
    RUN npx prisma generate
    
    # ------------------------------
    # Etapa 2: Producción
    # ------------------------------
    FROM node:20-alpine AS production
    
    ENV NODE_ENV=production
    
    RUN apk add --no-cache postgresql-client curl
    
    WORKDIR /usr/src/app
    
    COPY package*.json ./
    RUN npm ci --only=production
    
    COPY --from=build /usr/src/app/dist ./dist
    COPY --from=build /usr/src/app/prisma ./prisma
    
    EXPOSE 3000
    
    CMD ["node", "dist/server.js"]
    