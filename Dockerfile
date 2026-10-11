# Stap 1: de app bouwen met Node
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* ./
# `npm ci` als er een lockfile is (reproduceerbaar), anders `npm install`.
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY . .
RUN npm run build

# Stap 2: de statische bestanden serveren met Caddy, die ook zelf HTTPS regelt
FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv

EXPOSE 80 443 443/udp
