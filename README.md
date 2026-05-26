# El Sazón Uvitano — PWA de gestión operativa

## Descripción

Proyecto PWA para la operación del restaurante El Sazón Uvitano, con autenticación JWT, gestión de mesas y pedidos, caja, domicilios, GPS, chat en tiempo real, reportes diarios, soporte offline parcial y despliegue preparado para producción.

## Estructura

- `frontend/`: aplicación React + Vite + PWA
- `server/`: API Express + Socket.IO + Prisma
- `docker-compose.yml`: entorno local con PostgreSQL, backend y frontend
- `frontend/Dockerfile`: build del frontend y servidor Nginx
- `server/Dockerfile`: build del backend

## Requisitos

- Node.js 22+
- npm 10+
- PostgreSQL (si deseas ejecutar el backend sin Docker)

## Variables de entorno

### Backend

Copia `server/.env.example` a `.env` y ajusta los valores.

### Frontend

Copia `frontend/.env.example` a `.env` si necesitas sobreescribir valores de entorno.

## Ejecución local

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
npm run prisma:generate
npm run dev
```

### Base de datos

```bash
cd server
npm run prisma:migrate
```

## Despliegue con Docker

```bash
docker compose up --build
```

El frontend quedará disponible en `http://localhost:3000` y el backend en `http://localhost:4000`.

## Verificación

- `npm --prefix frontend run build`
- `npm --prefix server run build`

## Seguridad y producción

- JWT y bcrypt
- Helmet, rate limiting, CORS restringido en producción
- Variables sensibles en `.env`
- Nginx para servir frontend y proxy de API / Socket.IO

## Notas de operación

- Antes de usar en producción, cambie `JWT_SECRET` y `JWT_REFRESH_SECRET`.
- Configure `DATABASE_URL` con la instancia real de PostgreSQL.
- Revise `frontend/nginx.conf` y `docker-compose.yml` según el dominio final.
