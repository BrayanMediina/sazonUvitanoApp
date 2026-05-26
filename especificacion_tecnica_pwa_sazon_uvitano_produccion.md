# ESPECIFICACIÓN TÉCNICA COMPLETA — PWA RESTAURANTE EL SAZÓN UVITANO

Versión: 1.0
Entorno objetivo: Producción
Arquitectura: PWA Enterprise Modular
Modelo: Tiempo real + Offline First Parcial

---

# 1. VISIÓN GENERAL DEL PROYECTO

## 1.1 Nombre del sistema

El Sazón Uvitano — Plataforma PWA de Gestión Operativa para Restaurante.

---

## 1.2 Descripción general

El sistema consiste en una Progressive Web App (PWA) diseñada para la gestión integral del restaurante El Sazón Uvitano.

La plataforma centralizará:

- Gestión de mesas.
- Gestión de pedidos.
- Control de caja.
- Gestión de domicilios.
- Seguimiento GPS en tiempo real.
- Comunicación entre caja y domiciliarios.
- Reportes operativos diarios.
- Notificaciones push.
- Funcionamiento offline parcial.

El sistema estará orientado a operación productiva real.

---

# 2. OBJETIVOS DEL SISTEMA

## 2.1 Objetivo general

Desarrollar una PWA robusta, escalable y segura para gestionar la operación del restaurante mediante flujos en tiempo real, sincronización offline parcial y monitoreo de domicilios.

---

## 2.2 Objetivos específicos

- Centralizar la operación del restaurante.
- Reducir errores humanos.
- Mejorar tiempos de atención.
- Digitalizar caja y pedidos.
- Permitir monitoreo GPS.
- Permitir funcionamiento parcial sin internet.
- Implementar arquitectura escalable.
- Cumplir estándares modernos de PWAs productivas.

---

# 3. ALCANCE DEL PROYECTO

## Incluye

- Sistema de autenticación.
- Gestión de usuarios.
- Gestión de mesas.
- Gestión de pedidos.
- Gestión de caja.
- Domicilios.
- GPS en tiempo real.
- Chat interno.
- Notificaciones push.
- Reportes diarios.
- IndexedDB.
- Service Workers.
- Cache inteligente.
- Offline parcial.
- Deploy productivo.
- Seguridad.
- Auditoría.

---

## No incluye inicialmente

- Facturación electrónica DIAN.
- Pasarela de pagos online.
- Multi-sede.
- Inteligencia artificial.
- Integraciones ERP.
- Inventario avanzado.

---

# 4. ARQUITECTURA GENERAL

## 4.1 Arquitectura principal

Arquitectura modular desacoplada basada en:

- Frontend SPA/PWA.
- Backend API REST.
- Canal WebSocket.
- Persistencia SQL.
- Almacenamiento local.

---

## 4.2 Arquitectura tecnológica

```text
Cliente PWA
   ↓
Frontend React
   ↓
Service Worker
   ↓
API Gateway Express
   ↓
Backend Node.js
   ↓
PostgreSQL
```

---

# 5. TECNOLOGÍAS OFICIALES DEL PROYECTO

| Área | Tecnología |
|---|---|
| Frontend | React 19 |
| Build Tool | Vite |
| Lenguaje | TypeScript |
| UI | TailwindCSS |
| Estado global | Zustand |
| Fetching | TanStack Query |
| Backend | Node.js |
| Framework API | Express.js |
| Tiempo real | Socket.IO |
| ORM | Prisma |
| Base de datos | PostgreSQL |
| Validaciones | Zod |
| PWA | Workbox |
| Offline DB | IndexedDB |
| Push Notifications | Firebase Cloud Messaging |
| Mapas | Leaflet |
| Tiles | OpenStreetMap |
| Testing | Vitest + Playwright |
| Logs | Winston |
| Deploy | Docker |
| Reverse Proxy | Nginx |
| HTTPS | Let's Encrypt |

---

# 6. ESTÁNDARES DE CALIDAD OBLIGATORIOS

# 6.1 Lighthouse

El sistema deberá cumplir:

| Métrica | Objetivo |
|---|---|
| Performance | >= 90 |
| Accessibility | >= 95 |
| Best Practices | >= 95 |
| SEO | >= 90 |
| PWA | 100 |

---

# 6.2 Core Web Vitals

| Métrica | Objetivo |
|---|---|
| LCP | < 2.5s |
| INP | < 200ms |
| CLS | < 0.1 |
| FCP | < 1.8s |
| TTFB | < 800ms |

---

# 6.3 Auditoría DevTools

La aplicación deberá:

- No tener errores críticos en consola.
- No tener memory leaks.
- No tener assets bloqueantes innecesarios.
- Mantener bundle optimizado.
- Tener compresión GZIP/Brotli.
- Mantener lazy loading.
- Mantener tree shaking.

---

# 7. DISEÑO VISUAL Y PALETA OFICIAL

## 7.1 Colores extraídos del logo oficial

| Uso | Color | HEX |
|---|---|---|
| Primario oscuro | Marrón profundo | #5F290F |
| Primario cálido | Terracota | #C45E21 |
| Secundario | Dorado tostado | #CF9E55 |
| Fondo cálido | Beige crema | #E8C27C |
| Complementario | Café medio | #8F5B2A |
| Fondo claro | Blanco cálido | #FEFEFE |

---

## 7.2 Tipografía

### Principal

- Poppins.
- Inter.

---

## 7.3 Diseño UI

El sistema deberá usar:

- Diseño responsive mobile-first.
- Componentes reutilizables.
- Espaciado consistente.
- Bordes suaves.
- Elevaciones mínimas.
- Accesibilidad AA.
- Animaciones ligeras.

---

# 8. ESTRUCTURA DE ROLES

| Rol | Permisos |
|---|---|
| Mesero | Registrar pedidos |
| Cajero | Gestionar pedidos y pagos |
| Domiciliario | Ver domicilios y GPS |
| Administrador | Gestión completa |

---

# 9. REQUISITOS FUNCIONALES

# RF01 — Inicio de sesión

Autenticación segura basada en JWT.

Características:

- Login.
- Logout.
- Refresh token.
- Roles.
- Persistencia segura.

---

# RF02 — Gestión de mesas

Características:

- Crear mesas.
- Cambiar estado.
- Asociar pedidos.
- Liberar mesa.

Estados:

- Disponible.
- Ocupada.
- Pendiente pago.

---

# RF03 — Registro de pedidos

Características:

- Agregar productos.
- Observaciones.
- Cantidades.
- Tiempo de creación.
- Asociación a mesa.

---

# RF04 — Gestión de estados

Estados:

- Pedido tomado.
- En preparación.
- Listo.
- Entregado.
- Pagado.
- Finalizado.

---

# RF05 — Caja

Características:

- Cobro.
- Método de pago.
- Historial.
- Cierre diario.
- Reportes.

---

# RF06 — Domicilios

Características:

- Asignación.
- Estado.
- Seguimiento.
- Historial.

---

# RF07 — GPS tiempo real

La aplicación deberá usar:

```js
navigator.geolocation.watchPosition()
```

Funciones:

- Reporte constante.
- Actualización en tiempo real.
- Visualización en mapa.
- Seguimiento operativo.

---

# RF08 — Chat en tiempo real

Características:

- Socket.IO.
- Mensajes instantáneos.
- Confirmación visual.
- Notificaciones.

---

# RF09 — Notificaciones Push

Eventos:

- Nuevo pedido.
- Pedido listo.
- Nuevo domicilio.
- Mensajes.
- Alertas.

---

# RF10 — Offline parcial

El sistema deberá seguir funcionando parcialmente sin internet.

---

# 10. REQUISITOS NO FUNCIONALES

# 10.1 Seguridad

## Obligatorio

- HTTPS.
- CSP.
- Helmet.
- Sanitización.
- Rate limiting.
- Protección XSS.
- Protección CSRF.
- Validación Zod.
- Variables de entorno.
- JWT.
- Bcrypt.

---

# 10.2 Escalabilidad

La arquitectura deberá permitir:

- Nuevas sedes.
- Nuevos módulos.
- Nuevos roles.
- Horizontal scaling.

---

# 10.3 Disponibilidad

Objetivo:

99.9% uptime.

---

# 10.4 Rendimiento

- Carga inicial menor a 3 segundos.
- Tiempo real menor a 1 segundo.
- Consultas optimizadas.

---

# 11. ESPECIFICACIÓN PWA COMPLETA

# 11.1 Manifest.json

Debe incluir:

- name.
- short_name.
- icons.
- theme_color.
- background_color.
- display standalone.
- orientation.
- start_url.
- scope.

---

# 11.2 Service Worker

Debe manejar:

- Cache assets.
- Offline.
- Background sync.
- Push notifications.
- Actualización controlada.

---

# 11.3 Estrategias de caching

## Cache First

Usar para:

- CSS.
- JS.
- Fuentes.
- Imágenes.

---

## Network First

Usar para:

- Pedidos.
- Estados.
- Caja.
- GPS.

---

## Stale While Revalidate

Usar para:

- Menú.
- Configuración.
- Historial reciente.

---

# 11.4 Instalabilidad

La PWA deberá:

- Ser instalable.
- Funcionar standalone.
- Tener iconos adaptativos.
- Tener splash screen.

---

# 12. INDEXEDDB

# 12.1 Datos permitidos localmente

| Datos | Justificación |
|---|---|
| Sesión temporal | Persistencia |
| Menú | Offline |
| Pedidos temporales | Recuperación |
| Cola offline | Sincronización |
| Configuración | Rendimiento |

---

# 12.2 Datos NO permitidos localmente

| Datos | Motivo |
|---|---|
| Pagos completos | Seguridad |
| Historial total | Consistencia |
| Tokens sensibles | Riesgo |

---

# 13. ESTRUCTURA DE BASE DE DATOS

# Tablas principales

## users

- id
- name
- email
- password
- role
- created_at

---

## tables

- id
- number
- status

---

## orders

- id
- table_id
- status
- total
- created_at

---

## order_items

- id
- order_id
- product_id
- quantity

---

## products

- id
- name
- price
- category

---

## deliveries

- id
- order_id
- driver_id
- status
- current_lat
- current_lng

---

## payments

- id
- order_id
- amount
- method
- paid_at

---

# 14. ESTRUCTURA DE CARPETAS FRONTEND

```text
src/
 ├── app/
 ├── assets/
 ├── components/
 │    ├── ui/
 │    ├── layout/
 │    ├── forms/
 │    ├── maps/
 │    └── tables/
 ├── modules/
 │    ├── auth/
 │    ├── orders/
 │    ├── tables/
 │    ├── payments/
 │    ├── deliveries/
 │    ├── reports/
 │    └── admin/
 ├── pages/
 ├── routes/
 ├── services/
 ├── sockets/
 ├── hooks/
 ├── store/
 ├── workers/
 ├── indexeddb/
 ├── styles/
 ├── types/
 ├── utils/
 ├── constants/
 ├── validations/
 └── tests/
```

---

# 15. ESTRUCTURA DE CARPETAS BACKEND

```text
server/
 ├── src/
 │    ├── config/
 │    ├── modules/
 │    │    ├── auth/
 │    │    ├── users/
 │    │    ├── orders/
 │    │    ├── deliveries/
 │    │    ├── payments/
 │    │    └── reports/
 │    ├── middlewares/
 │    ├── sockets/
 │    ├── prisma/
 │    ├── routes/
 │    ├── services/
 │    ├── repositories/
 │    ├── validators/
 │    ├── logs/
 │    ├── utils/
 │    └── tests/
 ├── Dockerfile
 ├── docker-compose.yml
 └── package.json
```

---

# 16. ESTRUCTURA DE RUTAS FRONTEND

```text
/
/login
/dashboard
/mesas
/mesas/:id
/pedidos
/caja
/domicilios
/mapa
/chat
/reportes
/admin
```

---

# 17. ESTRUCTURA DE APIs

## Auth

```text
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
```

---

## Orders

```text
GET /api/orders
POST /api/orders
PATCH /api/orders/:id
```

---

## Payments

```text
POST /api/payments
GET /api/payments/report/daily
```

---

## Deliveries

```text
POST /api/deliveries
PATCH /api/deliveries/location
```

---

# 18. WEBSOCKETS

# Eventos principales

```text
order-created
order-updated
delivery-location
new-message
payment-completed
```

---

# 19. GPS EN TIEMPO REAL

# Flujo técnico

```text
GPS dispositivo
 ↓
watchPosition
 ↓
Socket.IO
 ↓
Backend
 ↓
Caja
 ↓
Mapa Leaflet
```

---

# 20. MAPAS

## Librería oficial

Leaflet.

---

## Tiles

OpenStreetMap.

---

## Funciones

- Marcadores.
- Movimiento tiempo real.
- Historial.
- Zoom.
- Ruta.

---

# 21. NOTIFICACIONES PUSH

# Proveedor

Firebase Cloud Messaging.

---

# Funciones

- Notificaciones foreground.
- Background.
- Push system.
- Alertas operativas.

---

# 22. CHAT

# Características

- Socket.IO.
- Persistencia temporal.
- Tiempo real.
- Indicador online.

---

# 23. LOGGING

# Sistema obligatorio

Winston.

---

# Logs mínimos

- Auth.
- Errores.
- API.
- Payments.
- WebSockets.
- GPS.

---

# 24. MONITOREO

# Recomendado

- Uptime Kuma.
- Grafana.
- Prometheus.

---

# 25. TESTING

# Unit Testing

Vitest.

---

# E2E

Playwright.

---

# Cobertura mínima

80%.

---

# 26. CI/CD

# Pipeline obligatorio

GitHub Actions.

---

# Flujo

```text
PR
 ↓
Lint
 ↓
Tests
 ↓
Build
 ↓
Deploy
```

---

# 27. LINTING Y FORMATO

# Herramientas

- ESLint.
- Prettier.
- Husky.
- lint-staged.

---

# 28. CONTENERIZACIÓN

# Docker obligatorio

Servicios:

- frontend.
- backend.
- postgres.
- nginx.

---

# 29. NGINX

# Funciones

- Reverse proxy.
- SSL termination.
- Compression.
- Cache headers.

---

# 30. SEGURIDAD AVANZADA

# Backend

- Helmet.
- CORS.
- Rate limit.
- Request sanitization.
- Secure cookies.

---

# Frontend

- CSP.
- Sanitización.
- Validación.
- Escape rendering.

---

# 31. BACKUPS

# Estrategia

- Backup diario.
- Backup incremental.
- Retención mínima 30 días.

---

# 32. DEPLOY PRODUCTIVO

# Arquitectura recomendada

```text
Cloudflare
 ↓
Nginx
 ↓
Frontend React
 ↓
Backend Express
 ↓
PostgreSQL
```

---

# 33. SERVIDORES RECOMENDADOS

## Desarrollo

- Railway.
- Render.
- Vercel.

---

## Producción

- VPS Ubuntu.
- DigitalOcean.
- Hetzner.
- AWS Lightsail.

---

# 34. CONFIGURACIÓN DEL VPS

# Recomendado

Ubuntu Server 24.04 LTS.

---

# Requisitos mínimos

| Recurso | Recomendado |
|---|---|
| CPU | 2 vCPU |
| RAM | 4 GB |
| SSD | 80 GB |
| Red | 1 Gbps |

---

# 35. VARIABLES DE ENTORNO

```env
DATABASE_URL=
JWT_SECRET=
JWT_REFRESH_SECRET=
PORT=
NODE_ENV=
FIREBASE_KEY=
SOCKET_PORT=
```

---

# 36. ESTÁNDARES DE CÓDIGO

# Backend

- Arquitectura modular.
- Clean code.
- SOLID.
- Repository pattern.
- DTO pattern.

---

# Frontend

- Componentes desacoplados.
- Atomic design.
- Hooks reutilizables.
- Lazy loading.

---

# 37. ACCESIBILIDAD

# Requisitos

- Navegación teclado.
- Contraste AA.
- Labels.
- aria-label.
- Focus visible.

---

# 38. OPTIMIZACIÓN

# Frontend

- Code splitting.
- Lazy loading.
- Dynamic imports.
- Image optimization.

---

# Backend

- Índices SQL.
- Pooling.
- Caching.
- Queries optimizadas.

---

# 39. OBSERVABILIDAD

# Métricas mínimas

- CPU.
- RAM.
- Latencia.
- Requests.
- Errores.
- Tiempo real.

---

# 40. ESTRATEGIA OFFLINE

# Flujo

```text
Sin internet
 ↓
Guardar IndexedDB
 ↓
Background Sync
 ↓
Reconexión
 ↓
Sincronización
```

---

# 41. ESTRATEGIA DE VERSIONAMIENTO

# Git Flow

```text
main
develop
feature/*
hotfix/*
```

---

# 42. DOCUMENTACIÓN

# Obligatoria

- Swagger/OpenAPI.
- README.
- Diagramas.
- Arquitectura.
- Variables entorno.
- Scripts.

---

# 43. PANTALLAS OFICIALES DEL SISTEMA

| Pantalla | Rol |
|---|---|
| Login | Todos |
| Dashboard | Todos |
| Mesas | Mesero/Caja |
| Pedido Mesa | Mesero |
| Caja | Cajero |
| Domicilios | Cajero |
| Seguimiento GPS | Cajero |
| Chat | Caja/Domiciliario |
| Reportes | Administrador |
| Gestión usuarios | Admin |
| Gestión productos | Admin |

---

# 44. FLUJO OPERATIVO PRINCIPAL

```text
Mesero crea pedido
 ↓
Caja recibe pedido
 ↓
Caja cambia estado
 ↓
Entrega
 ↓
Pago
 ↓
Reporte diario
```

---

# 45. FLUJO DOMICILIOS

```text
Caja crea domicilio
 ↓
Asignación domiciliario
 ↓
GPS tiempo real
 ↓
Seguimiento mapa
 ↓
Entrega
```

---

# 46. CONSIDERACIONES PRODUCTIVAS IMPORTANTES

# Obligatorio

- HTTPS.
- Monitoreo.
- Backups.
- Logs.
- Optimización.
- Rate limiting.
- Docker.
- Nginx.
- PWA correcta.
- Auditoría Lighthouse.

---

# 47. CRITERIOS DE ACEPTACIÓN

El sistema será considerado válido únicamente si:

- La PWA es instalable.
- Funciona offline parcialmente.
- El GPS funciona en tiempo real.
- El chat funciona correctamente.
- Las notificaciones funcionan.
- Lighthouse PWA es 100.
- No existen errores críticos.
- El deploy es estable.
- La arquitectura es modular.
- El sistema soporta producción.

---

# 48. CONCLUSIÓN

La plataforma PWA de El Sazón Uvitano deberá implementarse como una solución moderna, escalable, desacoplada y orientada completamente a producción real.

La arquitectura deberá priorizar:

- rendimiento,
- tiempo real,
- seguridad,
- experiencia móvil,
- operación offline parcial,
- observabilidad,
- mantenibilidad,
- escalabilidad.

El proyecto deberá seguir estándares modernos de ingeniería de software y cumplir criterios medibles mediante herramientas de auditoría técnica y rendimiento.

