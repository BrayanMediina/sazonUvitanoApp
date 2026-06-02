# Deploy gratuito — El Sazón Uvitano

## Arquitectura
- **Frontend** → [Vercel](https://vercel.com) (free)
- **Backend**  → [Render.com](https://render.com) (free, Node.js)
- **Database** → [Neon](https://neon.tech) (free, PostgreSQL)

---

## Paso 1 — Base de datos en Neon

1. Crear cuenta en https://neon.tech
2. Crear un proyecto → dar nombre `sazon-uvitano`
3. Copiar el **Connection string** (formato: `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require`)
4. Guardarlo → lo usarás en el paso 2.

---

## Paso 2 — Backend en Render

1. Crear cuenta en https://render.com
2. New → **Web Service** → conectar este repositorio GitHub
3. Configurar:
   - **Root Directory:** `server`
   - **Build Command:** `npm ci && npx prisma generate && npm run build`
   - **Start Command:** `npx prisma db push --accept-data-loss && node_modules/.bin/tsx prisma/seed.ts && node dist/index.js`
4. En **Environment Variables** agregar:
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=<tu connection string de Neon>
   JWT_SECRET=<mínimo 32 caracteres, genera uno random>
   JWT_REFRESH_SECRET=<mínimo 32 caracteres, diferente al anterior>
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   CORS_ORIGIN=https://sazon-uvitano.vercel.app
   VAPID_SUBJECT=mailto:julian.mediina@gmail.com
   VAPID_PUBLIC_KEY=BCTJCyAlRdnUAETXTvL14iQ5ECOIfa8Cu0xoxk1AaIn0nU1OuKF4XUUGe-iZneneFe14dHYCRRdy2z4O0THQvnU
   VAPID_PRIVATE_KEY=87oX8WSCTjRQr8hF4671LnZvrypBo2opmEPAth0KQok
   ```
5. Deploy → esperar que termine → copiar la URL pública (ej: `https://sazon-uvitano-backend.onrender.com`)

> **Nota Render free:** el servicio se "duerme" tras 15 min sin uso. El primer request tarda ~30s en despertar. Para la demo está bien.

---

## Paso 3 — Frontend en Vercel

1. Crear cuenta en https://vercel.com
2. New Project → importar este repositorio
3. Configurar:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite (auto-detectado)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. En **Environment Variables** agregar:
   ```
   VITE_API_URL=https://sazon-uvitano-backend.onrender.com
   VITE_SOCKET_URL=https://sazon-uvitano-backend.onrender.com
   ```
   *(reemplazar con la URL real de Render del paso 2)*
5. Deploy.

---

## Paso 4 — Actualizar CORS en Render

Una vez tengas la URL de Vercel (ej: `https://sazon-uvitano.vercel.app`), actualizar la variable en Render:
```
CORS_ORIGIN=https://sazon-uvitano.vercel.app
```
Render redesplegará automáticamente.

---

## Usuarios por defecto (seed)

| Rol | Documento | Contraseña |
|-----|-----------|------------|
| Administrador | 123456789 | admin123 |
| Mesero | 987654321 | mesero123 |
| Cajero | 111222333 | cajero123 |
| Domiciliario | 444555666 | domicilio123 |

---

## Desarrollo local

```bash
# Con Docker (todo incluido)
docker compose up

# Sin Docker
cd server && npm run dev          # puerto 3000
cd frontend && npm run dev        # puerto 5173
```
