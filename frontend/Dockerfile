FROM node:22-alpine AS builder
WORKDIR /app

# Instalar dependencias
COPY frontend/package*.json ./
RUN npm ci

# Copiar código fuente
COPY frontend/ ./

# Variables de entorno de Vite (build-time)
ARG VITE_API_URL=""
ARG VITE_SOCKET_URL="http://localhost:8080"
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL

# Build PWA
RUN npm run build

# Copiar imágenes de Leaflet al dist
RUN mkdir -p dist/images && \
    if [ -d node_modules/leaflet/dist/images ]; then \
      cp -R node_modules/leaflet/dist/images/* dist/images/; \
    fi

# ─── IMAGEN NGINX ────────────────────────────────────────────────
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
