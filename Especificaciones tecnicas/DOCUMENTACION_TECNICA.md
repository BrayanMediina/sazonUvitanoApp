# El Sazón Uvitano — Documentación Técnica Completa

**Versión:** 2.0  
**Tipo:** Progressive Web Application (PWA) — Sistema de gestión operativa para restaurante  
**Contexto académico:** Proyecto Final — Electiva 3 (Desarrollo de Aplicaciones Web Avanzadas)  
**Fecha:** Junio 2026

---

## Tabla de Contenidos

1. [Visión General del Sistema](#1-visión-general-del-sistema)
2. [Arquitectura General](#2-arquitectura-general)
3. [Estructura de Directorios](#3-estructura-de-directorios)
4. [Frontend — React PWA](#4-frontend--react-pwa)
   - 4.1 [Stack y dependencias](#41-stack-y-dependencias)
   - 4.2 [Punto de entrada](#42-punto-de-entrada)
   - 4.3 [Sistema de enrutamiento y control de acceso](#43-sistema-de-enrutamiento-y-control-de-acceso)
   - 4.4 [Gestión de estado global (Zustand)](#44-gestión-de-estado-global-zustand)
   - 4.5 [Sistema de tipos TypeScript](#45-sistema-de-tipos-typescript)
   - 4.6 [Capa de servicios HTTP](#46-capa-de-servicios-http)
   - 4.7 [Comunicación en tiempo real (Socket.IO Client)](#47-comunicación-en-tiempo-real-socketio-client)
   - 4.8 [Módulos funcionales](#48-módulos-funcionales)
   - 4.9 [Componentes reutilizables](#49-componentes-reuti lizables)
   - 4.10 [Hooks personalizados](#410-hooks-personalizados)
   - 4.11 [Validaciones (Zod)](#411-validaciones-zod)
   - 4.12 [Constantes y configuración UI](#412-constantes-y-configuración-ui)
   - 4.13 [Utilidades](#413-utilidades)
   - 4.14 [PWA — Service Worker y Workbox](#414-pwa--service-worker-y-workbox)
   - 4.15 [Soporte offline — IndexedDB con Dexie](#415-soporte-offline--indexeddb-con-dexie)
5. [Backend — Express + Node.js](#5-backend--express--nodejs)
   - 5.1 [Stack y dependencias](#51-stack-y-dependencias)
   - 5.2 [Punto de entrada y arranque](#52-punto-de-entrada-y-arranque)
   - 5.3 [Configuración de la aplicación Express](#53-configuración-de-la-aplicación-express)
   - 5.4 [Configuración de entorno (Zod)](#54-configuración-de-entorno-zod)
   - 5.5 [Módulos del backend](#55-módulos-del-backend)
   - 5.6 [Middlewares](#56-middlewares)
   - 5.7 [Servidor Socket.IO](#57-servidor-socketio)
   - 5.8 [Utilidades del servidor](#58-utilidades-del-servidor)
   - 5.9 [Servicio de Push Notifications (VAPID)](#59-servicio-de-push-notifications-vapid)
6. [Base de Datos — PostgreSQL + Prisma](#6-base-de-datos--postgresql--prisma)
   - 6.1 [Esquema completo](#61-esquema-completo)
   - 6.2 [Enumeraciones](#62-enumeraciones)
   - 6.3 [Modelos y relaciones](#63-modelos-y-relaciones)
   - 6.4 [Datos semilla (seed)](#64-datos-semilla-seed)
7. [API REST — Referencia de Endpoints](#7-api-rest--referencia-de-endpoints)
8. [Eventos WebSocket](#8-eventos-websocket)
9. [Autenticación y Seguridad](#9-autenticación-y-seguridad)
   - 9.1 [JWT](#91-jwt)
   - 9.2 [Reconocimiento facial (Face-API)](#92-reconocimiento-facial-face-api)
   - 9.3 [WebAuthn — biometría del SO](#93-webauthn--biometría-del-so)
   - 9.4 [Seguridad HTTP](#94-seguridad-http)
10. [Infraestructura y Despliegue](#10-infraestructura-y-despliegue)
    - 10.1 [Docker Compose — desarrollo local](#101-docker-compose--desarrollo-local)
    - 10.2 [Nginx — proxy inverso y servidor estático](#102-nginx--proxy-inverso-y-servidor-estático)
    - 10.3 [Dockerfiles](#103-dockerfiles)
    - 10.4 [Despliegue en producción (Vercel + Render + Neon)](#104-despliegue-en-producción-vercel--render--neon)
    - 10.5 [CI/CD — GitHub Actions](#105-cicd--github-actions)
11. [Flujos de Datos Principales](#11-flujos-de-datos-principales)
12. [Variables de Entorno](#12-variables-de-entorno)
13. [Comandos de Desarrollo](#13-comandos-de-desarrollo)

---

## 1. Visión General del Sistema

**El Sazón Uvitano** es un sistema de gestión operativa para restaurante implementado como Progressive Web Application (PWA). Permite la coordinación en tiempo real entre los diferentes roles del personal: meseros, cajeros, domiciliarios y administradores.

### Capacidades principales

| Funcionalidad | Descripción |
|---|---|
| Gestión de mesas | Estado en tiempo real, asignación de pedidos, cierre de cuenta |
| Pedidos de mesa | Creación, modificación, seguimiento por estado |
| Domicilios | Creación, asignación a domiciliario, rastreo GPS en tiempo real |
| Caja | Cobro de pedidos, múltiples métodos de pago, cambio automático |
| Chat interno | Mensajería en tiempo real entre todo el personal |
| Reportes | Resumen diario, ingresos por método de pago, productos más vendidos |
| Administración | CRUD de usuarios, productos y mesas |
| Notificaciones push | Alertas al dispositivo incluso con la app cerrada |
| Autenticación facial | Login por reconocimiento de rostro con cámara |
| Biometría (WebAuthn) | Login con huella digital o Face ID del sistema operativo |
| Funcionamiento offline | Cola de operaciones en IndexedDB, sincronización al reconectar |

### Roles del sistema

```
administrador → Acceso total a todas las funcionalidades
cajero        → Mesas, caja, domicilios, reportes, mapa
mesero        → Mesas, pedidos, chat
domiciliario  → Mis entregas, mapa, chat
```

---

## 2. Arquitectura General

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTE (Navegador / PWA instalada)       │
│                                                                   │
│   React 19 + TypeScript + TailwindCSS v4                         │
│   ├── Zustand 5 (estado global)                                   │
│   ├── TanStack Query 5 (caché HTTP)                               │
│   ├── React Router 7 (SPA routing + guards)                       │
│   ├── Socket.IO Client 4.8 (WebSocket)                           │
│   ├── Face-API / WebAuthn (biometría)                             │
│   ├── Dexie.js / IndexedDB (offline queue)                        │
│   └── Workbox / Service Worker (caché y push)                    │
└──────────────────────┬──────────────────────────────────────────┘
                       │ HTTPS + WSS
                       │
┌──────────────────────▼──────────────────────────────────────────┐
│                      NGINX (Reverse Proxy)                        │
│   /          → static files (dist/)                              │
│   /api/*     → proxy_pass backend:3000                           │
│   /socket.io → proxy_pass backend:3000 (WebSocket upgrade)       │
└──────────────────────┬──────────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────────┐
│                    BACKEND (Express 4 + Node 22)                  │
│                                                                   │
│   HTTP Server (node:http)                                         │
│   ├── Express app (REST API /api/*)                               │
│   │   ├── Helmet (security headers)                               │
│   │   ├── CORS (Bearer token, origin: *)                          │
│   │   ├── Rate Limiting (express-rate-limit)                      │
│   │   ├── JWT Middleware (auth + role guards)                     │
│   │   ├── Zod Validation Middleware                               │
│   │   └── Módulos: auth, users, tables, products, orders,        │
│   │               payments, deliveries, reports, chat, push       │
│   └── Socket.IO Server 4.8                                        │
│       ├── JWT auth middleware en handshake                        │
│       ├── Rooms por rol (role:mesero, role:cajero, ...)           │
│       └── Rooms por usuario (user:{id})                           │
└──────────────────────┬──────────────────────────────────────────┘
                       │ Prisma ORM
                       │
┌──────────────────────▼──────────────────────────────────────────┐
│                   PostgreSQL 16                                    │
│   Base de datos: sazon_uvitano                                    │
│   Modelos: User, Table, Product, Order, OrderItem,                │
│            Payment, Delivery, ChatMessage,                        │
│            PushSubscription, WebAuthnCredential                   │
└─────────────────────────────────────────────────────────────────┘
```

### Comunicación cliente-servidor

- **REST HTTP** — operaciones CRUD vía `fetch` con token Bearer en `Authorization` header
- **WebSocket (Socket.IO)** — eventos bidireccionales para chat, ubicación GPS y actualizaciones en tiempo real
- **Web Push (VAPID)** — notificaciones push del servidor al dispositivo, incluso con la app cerrada

---

## 3. Estructura de Directorios

```
sazonUvitanoApp/
│
├── frontend/                          # React PWA — cliente
│   ├── public/
│   │   ├── manifest.json              # Web App Manifest (PWA)
│   │   ├── favicon.svg
│   │   └── icons/
│   │       ├── icon-192.svg           # Ícono PWA 192×192
│   │       └── icon-512.svg           # Ícono PWA 512×512
│   │
│   ├── src/
│   │   ├── main.tsx                   # Bootstrap: ReactDOM + QueryClient + Router
│   │   ├── App.tsx                    # Raíz: QueryClientProvider + AppRouter
│   │   ├── config.ts                  # Constantes de configuración (BASE_URL)
│   │   │
│   │   ├── routes/
│   │   │   └── index.tsx              # BrowserRouter, guards RequireAuth/RequireRole
│   │   │
│   │   ├── store/
│   │   │   └── index.ts               # Zustand store: 7 slices + persist
│   │   │
│   │   ├── types/
│   │   │   └── index.ts               # Interfaces TypeScript globales
│   │   │
│   │   ├── services/
│   │   │   ├── api.ts                 # Cliente HTTP + todos los servicios REST
│   │   │   └── offline.ts             # Cola offline con IndexedDB/Dexie
│   │   │
│   │   ├── sockets/
│   │   │   └── index.ts               # Socket.IO client singleton
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.ts             # Login/logout con store y socket
│   │   │   ├── useOnlineStatus.ts     # Detectar online/offline
│   │   │   ├── useGPS.ts              # Geolocalización para domiciliarios
│   │   │   ├── useGeoTracking.ts      # Rastreo GPS extendido
│   │   │   ├── useNotifications.ts    # Push notifications
│   │   │   └── index.ts              # Barrel exports
│   │   │
│   │   ├── indexeddb/
│   │   │   └── db.ts                  # Instancia Dexie (offline queue)
│   │   │
│   │   ├── workers/
│   │   │   └── sw.ts                  # Service Worker (Workbox)
│   │   │
│   │   ├── validations/
│   │   │   ├── authSchemas.ts         # Zod: login, registro
│   │   │   ├── orderSchemas.ts        # Zod: crear pedido, añadir ítem
│   │   │   └── index.ts
│   │   │
│   │   ├── constants/
│   │   │   ├── orderStatus.ts         # Labels y colores de estados
│   │   │   ├── paymentMethods.ts      # Métodos de pago disponibles
│   │   │   ├── roles.ts               # Metadatos de roles
│   │   │   └── index.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── formatCurrency.ts      # Formato COP
│   │   │   ├── formatDate.ts          # Fechas en español
│   │   │   ├── classNames.ts          # Concatenador de clases CSS
│   │   │   └── index.ts
│   │   │
│   │   ├── components/
│   │   │   ├── ui/                    # Átomos UI reutilizables
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Select.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── BottomSheet.tsx
│   │   │   │   ├── Spinner.tsx
│   │   │   │   ├── PageLoader.tsx
│   │   │   │   ├── EmptyState.tsx
│   │   │   │   ├── ErrorState.tsx
│   │   │   │   ├── Avatar.tsx
│   │   │   │   ├── OfflineBanner.tsx
│   │   │   │   ├── Toast.tsx
│   │   │   │   └── index.ts
│   │   │   ├── layout/
│   │   │   │   ├── BottomNav.tsx      # Navegación inferior por rol
│   │   │   │   ├── PageHeader.tsx     # Encabezado de página
│   │   │   │   └── index.ts
│   │   │   ├── maps/
│   │   │   │   ├── DeliveryMap.tsx    # Mapa Leaflet con pin del domiciliario
│   │   │   │   └── index.ts
│   │   │   ├── forms/
│   │   │   │   ├── CurrencyInput.tsx  # Input con formato de moneda
│   │   │   │   ├── PhoneInput.tsx     # Input de teléfono
│   │   │   │   ├── FormField.tsx      # Wrapper label + error
│   │   │   │   └── index.ts
│   │   │   ├── Button.tsx             # Botón legado (ver ui/Button.tsx)
│   │   │   ├── Card.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Layout.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── pages/
│   │   │   ├── NotFoundPage.tsx       # Página 404
│   │   │   └── index.ts
│   │   │
│   │   ├── modules/                   # Módulos de funcionalidad
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.tsx      # Login con tabs: contraseña / cámara / biometría
│   │   │   │   └── index.ts
│   │   │   ├── dashboard/
│   │   │   │   └── index.ts           # Métricas en tiempo real
│   │   │   ├── mesas/
│   │   │   │   ├── MesasPage.tsx      # Grid de todas las mesas
│   │   │   │   ├── components/
│   │   │   │   │   ├── MesaCard.tsx   # Tarjeta de mesa con estado
│   │   │   │   │   ├── MesaStatusBadge.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts
│   │   │   ├── pedidos/
│   │   │   │   ├── PedidosPage.tsx
│   │   │   │   ├── components/
│   │   │   │   │   ├── ProductCard.tsx
│   │   │   │   │   ├── MenuCatalog.tsx
│   │   │   │   │   ├── OrderCart.tsx
│   │   │   │   │   ├── OrderItemRow.tsx
│   │   │   │   │   ├── OrderStatusStepper.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts
│   │   │   ├── caja/
│   │   │   │   ├── components/
│   │   │   │   │   ├── PedidoCobroCard.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts
│   │   │   ├── domicilios/
│   │   │   │   ├── DomiciliosPage.tsx
│   │   │   │   ├── components/
│   │   │   │   │   ├── DomicilioStatusBadge.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts
│   │   │   ├── mapa/
│   │   │   │   └── index.ts           # Mapa GPS en tiempo real
│   │   │   ├── chat/
│   │   │   │   ├── components/
│   │   │   │   │   ├── MessageBubble.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts
│   │   │   ├── reportes/
│   │   │   │   ├── ReportesPage.tsx
│   │   │   │   ├── components/
│   │   │   │   │   ├── MetodoPagoChart.tsx
│   │   │   │   │   ├── ResumenDiario.tsx
│   │   │   │   │   ├── TopProductosTable.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts
│   │   │   └── admin/
│   │   │       ├── AdminPage.tsx
│   │   │       ├── usuarios/
│   │   │       │   ├── UsuarioFormModal.tsx
│   │   │       │   ├── components/
│   │   │       │   └── index.ts
│   │   │       ├── productos/
│   │   │       │   ├── ProductosPage.tsx
│   │   │       │   ├── ProductoFormModal.tsx
│   │   │       │   ├── ProductoCard.tsx
│   │   │       │   ├── components/
│   │   │       │   └── index.ts
│   │   │       ├── mesas/
│   │   │       │   ├── MesasAdminPage.tsx
│   │   │       │   ├── MesaFormModal.tsx
│   │   │       │   ├── components/
│   │   │       │   └── index.ts
│   │   │       └── index.ts
│   │   │
│   │   └── styles/
│   │       └── (CSS global via TailwindCSS v4)
│   │
│   ├── index.html                     # HTML shell de la SPA
│   ├── vite.config.ts                 # Vite + VitePWA config
│   ├── tsconfig.json                  # TypeScript raíz
│   ├── tsconfig.app.json              # TypeScript aplicación
│   ├── eslint.config.js               # ESLint v10
│   ├── .env.example                   # Variables de entorno del frontend
│   ├── Dockerfile                     # Multi-stage: Node build → Nginx serve
│   └── nginx.conf                     # Config Nginx para SPA + proxy
│
├── server/                            # Backend Express
│   ├── prisma/
│   │   ├── schema.prisma              # Esquema completo de BD
│   │   └── seed.ts                    # Datos iniciales (usuarios, mesas, productos)
│   │
│   ├── src/
│   │   ├── index.ts                   # Arranque: HTTP server + Socket.IO + Prisma
│   │   ├── app.ts                     # Express: middlewares + rutas + error handler
│   │   │
│   │   ├── config/
│   │   │   ├── env.ts                 # Validación de .env con Zod
│   │   │   └── database.ts            # Singleton Prisma Client
│   │   │
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts     # Verifica JWT Bearer → req.user
│   │   │   ├── role.middleware.ts     # Guard por rol
│   │   │   ├── validate.middleware.ts # Valida body con esquema Zod
│   │   │   └── error.middleware.ts    # Handler global de errores
│   │   │
│   │   ├── utils/
│   │   │   ├── jwt.ts                 # signAccessToken / signRefreshToken / verify*
│   │   │   ├── hash.ts                # hashPassword / comparePassword (bcrypt)
│   │   │   └── pagination.ts          # Helpers de paginación
│   │   │
│   │   ├── services/
│   │   │   └── push.service.ts        # web-push: enviar notificaciones VAPID
│   │   │
│   │   ├── sockets/
│   │   │   └── socket.server.ts       # Socket.IO server: auth, rooms, eventos
│   │   │
│   │   └── modules/
│   │       ├── auth/
│   │       │   ├── auth.routes.ts     # POST /login /register /refresh /logout /me
│   │       │   ├── auth.service.ts    # Lógica de autenticación
│   │       │   ├── auth.schemas.ts    # Zod: loginSchema, registerSchema
│   │       │   ├── face.service.ts    # Enroll y verify descriptor facial
│   │       │   └── webauthn.service.ts# WebAuthn: registro y verificación
│   │       ├── users/
│   │       │   ├── users.routes.ts    # CRUD usuarios (admin)
│   │       │   └── users.service.ts
│   │       ├── tables/
│   │       │   ├── tables.routes.ts   # CRUD mesas
│   │       │   └── tables.service.ts
│   │       ├── products/
│   │       │   ├── products.routes.ts # CRUD productos
│   │       │   └── products.service.ts
│   │       ├── orders/
│   │       │   ├── orders.routes.ts   # CRUD pedidos + items
│   │       │   └── orders.service.ts
│   │       ├── payments/
│   │       │   ├── payments.routes.ts # Procesar pago, historial
│   │       │   └── payments.service.ts
│   │       ├── deliveries/
│   │       │   ├── deliveries.routes.ts # CRUD domicilios
│   │       │   └── deliveries.service.ts
│   │       ├── reports/
│   │       │   ├── reports.routes.ts  # GET resumen diario
│   │       │   └── reports.service.ts
│   │       ├── chat/
│   │       │   └── chat.routes.ts     # GET historial de mensajes
│   │       └── push/
│   │           └── push.routes.ts     # VAPID key + subscribe
│   │
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile                     # Multi-stage: Node build → Node run
│   └── .env.example
│
├── docker-compose.yml                 # Orquestación local: postgres + backend + frontend
├── .github/
│   └── workflows/
│       └── ci.yml                     # GitHub Actions: lint + build frontend + backend
└── DOCUMENTACION_TECNICA.md          # Este documento
```

---

## 4. Frontend — React PWA

### 4.1 Stack y dependencias

**`frontend/package.json`** — versión `2.0.0`

| Paquete | Versión | Propósito |
|---|---|---|
| `react` + `react-dom` | ^19.2.6 | UI framework |
| `typescript` | ~6.0.2 | Tipado estático |
| `vite` | ^8.0.12 | Bundler y dev server |
| `tailwindcss` | ^4.3.0 | Utility-first CSS |
| `@tailwindcss/postcss` | ^4.3.0 | Plugin PostCSS para Tailwind v4 |
| `zustand` | ^5.0.13 | Estado global |
| `@tanstack/react-query` | ^5.100.14 | Caché y fetching de datos |
| `react-router-dom` | ^7.15.1 | Routing SPA |
| `socket.io-client` | ^4.8.3 | WebSocket cliente |
| `@vladmandic/face-api` | ^1.7.15 | Reconocimiento facial (TensorFlow.js) |
| `@simplewebauthn/browser` | ^13.3.0 | WebAuthn biometría del SO |
| `leaflet` + `react-leaflet` | ^1.9.4 / ^5.0.0 | Mapas GPS interactivos |
| `dexie` | ^3.2.7 | IndexedDB (offline queue) |
| `react-hook-form` | ^7.54.0 | Formularios performativos |
| `@hookform/resolvers` | ^5.4.0 | Integración RHF + Zod |
| `zod` | ^3.24.0 | Validación de esquemas |
| `lucide-react` | ^0.468.0 | Iconos SVG |
| `vite-plugin-pwa` | ^1.3.0 | Generación SW + manifest |
| `workbox-*` | ^7.4.x | Estrategias de caché PWA |

### 4.2 Punto de entrada

**`frontend/index.html`** es el shell HTML de la SPA. Incluye:
- `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` — soporte para notch en iOS
- `<meta name="theme-color" content="#5F290F">` — color de barra del navegador
- `<link rel="manifest" href="/manifest.json">` — manifest PWA
- `<meta name="mobile-web-app-capable" content="yes">` — modo standalone Android
- `<meta name="apple-mobile-web-app-capable" content="yes">` — modo standalone iOS
- Un único `<div id="root"></div>` donde React monta la aplicación

**`frontend/src/main.tsx`** inicializa `ReactDOM.createRoot` y envuelve la aplicación en `<QueryClientProvider>`.

**`frontend/src/App.tsx`** renderiza `<AppRouter />` que contiene todo el sistema de rutas.

### 4.3 Sistema de enrutamiento y control de acceso

**Archivo:** `frontend/src/routes/index.tsx`

La aplicación usa **React Router 7** con `BrowserRouter`. Todas las páginas se cargan de forma perezosa (`React.lazy`) para code splitting automático.

#### Guards de seguridad

```
RequireAuth
  └─ Lee user + accessToken del store
  └─ Si no hay sesión → redirect /login
  └─ Si hay sesión → renderiza <Outlet />

RequireRole({ roles: Role[] })
  └─ Lee user.role del store
  └─ Si el rol no está en la lista → redirect /dashboard
  └─ Si el rol es válido → renderiza <Outlet />
```

#### Mapa de rutas por rol

| Ruta | Roles con acceso |
|---|---|
| `/login` | Pública |
| `/dashboard` | Todos los roles autenticados |
| `/chat` | Todos los roles autenticados |
| `/mesas` | mesero, cajero, administrador |
| `/mesas/:id` | mesero, cajero, administrador |
| `/pedidos/:id` | mesero, cajero, administrador |
| `/pedidos/nuevo` | mesero, administrador |
| `/caja` | cajero, administrador |
| `/domicilios` | cajero, administrador |
| `/domicilios/nuevo` | cajero, administrador |
| `/mapa` | cajero, domiciliario, administrador |
| `/mis-entregas` | domiciliario |
| `/reportes` | cajero, administrador |
| `/admin` y sub-rutas | cajero, administrador |

#### Navegación inferior (BottomNav)

Cada rol tiene un conjunto diferente de ítems en la barra de navegación inferior:

- **mesero:** Inicio, Mesas, Chat
- **cajero:** Inicio, Mesas, Caja, Domicilios, Chat
- **domiciliario:** Inicio, Entregas, Mapa, Chat
- **administrador:** Inicio, Mesas, Caja, Reportes, Admin

### 4.4 Gestión de estado global (Zustand)

**Archivo:** `frontend/src/store/index.ts`

El store se crea con `zustand` v5 usando el middleware `persist`. Está compuesto por 7 slices fusionadas en un único store `AppStore`.

#### Configuración de persistencia

Solo `user` y `accessToken` se persisten en `localStorage` bajo la clave `sazon-store`. El resto del estado (mesas, pedidos, chat, etc.) es efímero y se recarga al montar la app.

```typescript
type PersistedState = Pick<AppStore, 'user' | 'accessToken'>

create<AppStore>()(
  persist<AppStore, [], [], PersistedState>(
    (set) => ({ ... }),
    {
      name: 'sazon-store',
      partialize: (s) => ({ user: s.user, accessToken: s.accessToken }),
    }
  )
)
```

#### Slices del store

**AuthSlice**
```typescript
user: User | null
accessToken: string | null
setUser(user, token): void   // login exitoso
clearAuth(): void            // logout
```

**TablesSlice**
```typescript
tables: Table[]
setTables(tables): void
updateTable(id, data: Partial<Table>): void
```

**OrdersSlice**
```typescript
orders: Order[]
activeOrder: Order | null
setOrders(orders): void
setActiveOrder(order | null): void
updateOrder(id, data: Partial<Order>): void
```

**DeliveriesSlice**
```typescript
deliveries: Delivery[]
driverLocations: Record<string, LocationUpdate>  // key: driverId
setDeliveries(deliveries): void
updateDelivery(id, data: Partial<Delivery>): void
updateDriverLocation(update: LocationUpdate): void
```

**ChatSlice**
```typescript
messages: ChatMessage[]     // máx. 100 mensajes en memoria
unreadCount: number
addMessage(msg): void        // ignora duplicados por ID
initMessages(msgs): void     // carga historial, resetea unreadCount
markAllRead(): void
```

**NotificationsSlice**
```typescript
notifications: AppNotification[]  // máx. 50 notificaciones
unreadNotifications: number
addNotification(n): void
markNotificationRead(id): void
```

**UISlice**
```typescript
isOnline: boolean             // estado de red
pendingSyncCount: number      // ítems en cola offline
setOnline(v): void
incrementPending(): void
decrementPending(): void
```

### 4.5 Sistema de tipos TypeScript

**Archivo:** `frontend/src/types/index.ts`

Define todas las interfaces compartidas entre componentes, servicios y el store.

```typescript
type Role = 'administrador' | 'cajero' | 'mesero' | 'domiciliario'
type TableStatus = 'disponible' | 'ocupada' | 'pendiente_pago'
type ProductCategory = 'entrada' | 'plato_principal' | 'bebida' | 'postre' | 'especial' | 'domicilio'
type OrderType = 'mesa' | 'domicilio'
type OrderStatus = 'tomado' | 'en_preparacion' | 'listo' | 'entregado' | 'pagado' | 'finalizado' | 'cancelado'
type PaymentMethod = 'efectivo' | 'tarjeta' | 'transferencia' | 'nequi' | 'daviplata'
type DeliveryStatus = 'pendiente' | 'asignado' | 'en_camino' | 'entregado' | 'cancelado'

interface User {
  id: string; name: string; document: string; email?: string
  phone?: string; role: Role; isActive: boolean; createdAt: string
}

interface Table {
  id: string; number: number; status: TableStatus
  capacity?: number; zone?: string; currentOrderId?: string
}

interface Product {
  id: string; name: string; description?: string; price: number
  category: ProductCategory; imageUrl?: string
  isAvailable: boolean; isActive: boolean
}

interface Order {
  id: string; type: OrderType; tableId?: string; table?: Table
  items: OrderItem[]; status: OrderStatus; total: number
  notes?: string; createdBy: string; createdAt: string; updatedAt: string
}

interface OrderItem {
  id: string; productId: string; product: Product
  quantity: number; unitPrice: number; subtotal: number; notes?: string
}

interface Payment {
  id: string; orderId: string; amount: number; method: PaymentMethod
  receivedAmount?: number; change?: number; paidAt: string; cashierId: string
}

interface Delivery {
  id: string; orderId: string; order: Order; driverId?: string; driver?: User
  status: DeliveryStatus; street: string; neighborhood?: string
  reference?: string; addressLat?: number; addressLng?: number
  currentLat?: number; currentLng?: number; estimatedTime?: number
  customerName: string; customerPhone: string; createdAt: string; updatedAt: string
}

interface ChatMessage {
  id: string; senderId: string; senderName: string; senderRole: Role
  content: string; timestamp: string; read: boolean
}

interface LocationUpdate {
  driverId: string; lat: number; lng: number; timestamp: number
}

interface AppNotification {
  id: string; title: string; body: string; type: string
  read: boolean; createdAt: string
}
```

### 4.6 Capa de servicios HTTP

**Archivo:** `frontend/src/services/api.ts`

#### Cliente base `http<T>`

Función genérica que:
1. Lee `accessToken` desde el store de Zustand
2. Añade `Authorization: Bearer <token>` al header
3. En respuesta 401: intenta refresh token → reintenta la petición original
4. Extrae automáticamente `.data` de la respuesta `{ success, data }`
5. Lanza `Error` con el mensaje del servidor en caso de fallo

#### Servicios disponibles

**`authService`**
```
login(document, password)     → AuthResponse
register(data)                → { user, pendingActivation }
logout()                      → void
me()                          → User
face.enroll(descriptor[])     → { enrolled: boolean }
face.verify(document, desc[]) → AuthResponse
face.hasDescriptor()          → { hasDescriptor: boolean }
webauthn.getRegOptions()      → PublicKeyCredentialCreationOptions
webauthn.verifyReg(response)  → { verified: boolean }
webauthn.getLoginOptions(doc) → { options, userId }
webauthn.verifyLogin(uid, r)  → AuthResponse
webauthn.hasCredential()      → { hasCredential: boolean }
```

**`tablesService`**
```
getAll()              → Table[]
getById(id)           → Table
create(body)          → Table
update(id, body)      → Table
updateStatus(id, s)   → Table
delete(id)            → void
```

**`productsService`**
```
getAll(params?)         → Product[]
getById(id)             → Product
create(body)            → Product
update(id, body)        → Product
toggleAvailability(id)  → Product
delete(id)              → void
```

**`ordersService`**
```
getAll(params?)         → Order[]
getById(id)             → Order
create(body)            → Order
updateStatus(id, s)     → Order
addItem(orderId, item)  → Order
removeItem(oid, iid)    → Order
cancel(id)              → Order
```

**`paymentsService`**
```
processPayment(body)    → Payment
getDailyReport(date?)   → DailySummary
getHistory(params?)     → PaginatedResponse<Payment>
```

**`deliveriesService`**
```
getAll(params?)           → Delivery[]
getById(id)               → Delivery
getMyDeliveries()         → Delivery[]
getAvailableDrivers()     → { id, name, phone }[]
create(body)              → Delivery
assign(id, driverId)      → Delivery
updateStatus(id, status)  → Delivery
updateLocation(id, lat, lng) → Delivery
```

**`usersService`**
```
getAll(params?)         → PaginatedResponse<User>
getById(id)             → User
create(body)            → User
update(id, body)        → User
toggleActive(id)        → User
resetPassword(id, pwd)  → void
```

**`chatService`**
```
getHistory(limit?)  → ChatMessage[]
```

**`reportsService`**
```
getDailySummary(date?)  → DailySummary
getPeriodReport(from, to) → DailySummary[]
```

**`pushService`**
```
getVapidKey()             → { publicKey: string }
subscribe(subscription)   → { subscribed: boolean }
```

### 4.7 Comunicación en tiempo real (Socket.IO Client)

**Archivo:** `frontend/src/sockets/index.ts`

Implementa un singleton del cliente Socket.IO. La conexión se inicializa al hacer login exitoso, pasando el `accessToken` en el `auth` del handshake:

```typescript
socket = io(SOCKET_URL, {
  auth: { token: accessToken },
  transports: ['polling', 'websocket'],
})
```

Los hooks que consumen el socket escuchan los eventos:
- `chat:message` → `store.addMessage(msg)`
- `delivery:location` → `store.updateDriverLocation(update)`
- `connect_error` → manejo de autenticación fallida

### 4.8 Módulos funcionales

Cada módulo en `src/modules/` agrupa las páginas y componentes de una funcionalidad completa, siguiendo el patrón de colocation.

#### Módulo auth (`/modules/auth/`)

**`LoginPage.tsx`** — Pantalla de acceso con tres tabs:
1. **Contraseña** — Formulario de `document` + `password` con validación Zod
2. **Cámara facial** — Activa `face-api.js` para capturar descriptor facial y verificar contra el servidor
3. **Biometría del SO** — Inicia flujo WebAuthn (huella / Face ID del dispositivo)

#### Módulo dashboard (`/modules/dashboard/`)

Muestra métricas clave en tiempo real:
- Total de mesas ocupadas vs disponibles
- Pedidos activos por estado
- Domicilios en curso
- Resumen de caja del día

#### Módulo mesas (`/modules/mesas/`)

**`MesasPage.tsx`** — Grid responsivo de todas las mesas del restaurante. Cada `MesaCard` muestra número, zona, capacidad y estado con color:
- Verde → disponible
- Naranja → ocupada
- Ámbar → pendiente_pago

Tapping en una mesa navega a `MesaDetallePage` donde se puede ver el pedido activo e ítems.

#### Módulo pedidos (`/modules/pedidos/`)

**Crear pedido** — `PedidoNuevoPage` presenta el catálogo de productos (`MenuCatalog`) organizado por categoría. El mesero agrega ítems al carrito (`OrderCart`) y confirma el pedido.

**Detalle de pedido** — `PedidoDetallePage` muestra los ítems, permite añadir/remover y cambia el estado vía `OrderStatusStepper`:
```
tomado → en_preparacion → listo → entregado → pagado → finalizado
```

#### Módulo caja (`/modules/caja/`)

Lista pedidos en estado `listo` y `entregado`. Al seleccionar uno aparece el modal de cobro con:
- Método de pago (efectivo, tarjeta, Nequi, Daviplata, transferencia)
- Monto recibido (para efectivo)
- Cálculo automático de cambio

#### Módulo domicilios (`/modules/domicilios/`)

**`DomiciliosPage.tsx`** (cajero/admin) — Lista de todos los domicilios con estado y opción de asignar domiciliario.

**`DomicilioNuevoPage`** — Formulario para crear domicilio: datos del cliente, dirección, ítems del pedido.

**`MisEntregasPage`** (domiciliario) — Vista personalizada con solo los domicilios asignados al usuario autenticado.

#### Módulo mapa (`/modules/mapa/`)

Mapa Leaflet que muestra en tiempo real la ubicación de los domiciliarios via eventos Socket.IO `delivery:location`. Los cajeros y administradores ven todos los repartidores activos.

#### Módulo chat (`/modules/chat/`)

Chat grupal en tiempo real. Los mensajes se persisten en la BD y se emiten a todos los usuarios conectados. Implementa deduplicación por ID para evitar doble renderizado de mensajes propios (optimistic + echo del servidor).

#### Módulo reportes (`/modules/reportes/`)

- **`ResumenDiario`** — Métricas del día: total pedidos, ingresos, ticket promedio
- **`MetodoPagoChart`** — Gráfico de distribución de métodos de pago
- **`TopProductosTable`** — Tabla de productos más vendidos con cantidad y total

#### Módulo admin (`/modules/admin/`)

Panel de administración con tres sub-secciones:
- **Usuarios** — CRUD, activar/desactivar, restablecer contraseña
- **Productos** — CRUD, toggle disponibilidad, categorías
- **Mesas** — CRUD, capacidad, zonas

### 4.9 Componentes reutilizables

**`src/components/ui/`** — Biblioteca de átomos UI:

| Componente | Descripción |
|---|---|
| `Button` | Botón con variantes (primary, secondary, danger, ghost), tamaños y estado loading |
| `Input` | Input con label, error, iconos prefijo/sufijo |
| `Select` | Selector nativo estilizado |
| `Badge` | Etiqueta de estado con color semántico |
| `BottomSheet` | Drawer inferior modal para móvil |
| `Spinner` | Indicador de carga circular |
| `PageLoader` | Pantalla completa de carga para Suspense |
| `EmptyState` | Mensaje de estado vacío con ícono |
| `ErrorState` | Pantalla de error con botón de reintento |
| `Avatar` | Avatar circular con iniciales del usuario |
| `OfflineBanner` | Barra amarilla de modo sin conexión |
| `Toast` | Notificación toast temporal |

**`src/components/layout/`**

| Componente | Descripción |
|---|---|
| `BottomNav` | Navegación inferior adaptada al rol del usuario |
| `PageHeader` | Encabezado de página con título, subtítulo y back button |

**`src/components/maps/`**

| Componente | Descripción |
|---|---|
| `DeliveryMap` | Mapa Leaflet con marcador del domiciliario, actualización en tiempo real |

**`src/components/forms/`**

| Componente | Descripción |
|---|---|
| `CurrencyInput` | Input con formato automático en pesos COP |
| `PhoneInput` | Input de teléfono con formato colombiano |
| `FormField` | Wrapper: label + input + mensaje de error |

### 4.10 Hooks personalizados

**`useAuth`** (`src/hooks/useAuth.ts`)
- `login(data)` — llama `authService.login()`, guarda en store, inicializa socket
- `logout()` — limpia store, desconecta socket, navega a `/login`

**`useOnlineStatus`** (`src/hooks/useOnlineStatus.ts`)
- Escucha `window.addEventListener('online' | 'offline')`
- Actualiza `store.setOnline()`
- Dispara sincronización de cola offline al reconectar

**`useGPS`** (`src/hooks/useGPS.ts`)
- Solo activo si `user.role === 'domiciliario'`
- Usa `navigator.geolocation.watchPosition()`
- Emite `driver:location` por Socket.IO cada vez que cambia la posición

**`useGeoTracking`** (`src/hooks/useGeoTracking.ts`)
- Extiende `useGPS` con lógica de pausa/reanudación
- Actualiza `delivery.currentLat/Lng` vía API cuando el domiciliario cambia de estado a `en_camino`

**`useNotifications`** (`src/hooks/useNotifications.ts`)
- Solicita permiso `Notification.permission`
- Registra el SW y crea `PushManager.subscribe()`
- Envía la suscripción al endpoint `/api/push/subscribe`

### 4.11 Validaciones (Zod)

**`src/validations/authSchemas.ts`**
```typescript
loginSchema: z.object({
  document: z.string().min(6).max(20),
  password: z.string().min(6),
})

registerSchema: z.object({
  name: z.string().min(2).max(100),
  document: z.string().min(6).max(20),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  password: z.string().min(6),
  role: z.enum(['mesero','cajero','domiciliario','administrador']),
})
```

**`src/validations/orderSchemas.ts`**
```typescript
addItemSchema: z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1),
  notes: z.string().optional(),
})

createOrderSchema: z.object({
  type: z.enum(['mesa','domicilio']),
  tableId: z.string().uuid().optional(),
  items: z.array(addItemSchema).min(1),
  notes: z.string().optional(),
})
```

### 4.12 Constantes y configuración UI

**`src/constants/orderStatus.ts`** — Define para cada `OrderStatus` su etiqueta en español y el color de Tailwind v4 correspondiente, usado por `Badge` y `OrderStatusStepper`.

**`src/constants/paymentMethods.ts`** — Array de métodos de pago con label e ícono para el modal de cobro.

**`src/constants/roles.ts`** — Metadatos de cada rol: nombre legible, color e ícono.

### 4.13 Utilidades

**`formatCurrency(amount: number): string`** — Formatea a pesos colombianos con `Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' })`.

**`formatDate(date: string | Date): string`** — Formatea fechas en español colombiano (ej. "martes 3 de junio de 2026").

**`classNames(...classes: string[]): string`** — Concatena clases CSS de forma condicional, alternativa ligera a `clsx`.

### 4.14 PWA — Service Worker y Workbox

**`frontend/vite.config.ts`** — Configuración VitePWA:

```typescript
VitePWA({
  strategies: 'injectManifest',  // SW personalizado
  srcDir: 'src',
  filename: 'sw.ts',
  registerType: 'autoUpdate',    // actualiza SW sin intervención del usuario
  injectRegister: 'auto',
  includeAssets: ['favicon.svg', 'icons/icon-192.svg', 'icons/icon-512.svg'],
  manifest: {
    name: 'El Sazón Uvitano',
    short_name: 'Sazón Uvitano',
    description: 'Sistema de gestión operativa para restaurante',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    theme_color: '#5F290F',
    background_color: '#FEFEFE',
    lang: 'es-CO',
    icons: [
      { src: '/icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
      { src: '/icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'maskable any' },
    ],
  },
})
```

**`frontend/src/workers/sw.ts`** — Service Worker personalizado con estrategias Workbox:

| Recurso | Estrategia | Descripción |
|---|---|---|
| Shell HTML | Precache | Incluido en el manifiesto de precaché al hacer build |
| JS/CSS/fonts | Cache First | Sirve desde caché, actualiza en background |
| Llamadas API `/api/*` | Network First | Intenta red, cae a caché si falla |
| Imágenes | Stale While Revalidate | Sirve caché inmediatamente, actualiza en background |

El SW también maneja el evento `push` para mostrar notificaciones nativas del SO aunque la app esté cerrada.

### 4.15 Soporte offline — IndexedDB con Dexie

**Archivo:** `frontend/src/indexeddb/db.ts`

```typescript
const db = new Dexie('sazon-uvitano-offline')
db.version(1).stores({
  queue: '++id, type, createdAt'
})
```

**`frontend/src/services/offline.ts`** expone:
- `enqueueOfflineItem(item)` — guarda operación pendiente cuando no hay red
- `getOfflineQueue()` → `OfflineQueueItem[]`
- `clearOfflineQueue()` — limpia la cola tras sincronización exitosa

El hook `useOnlineStatus` detecta reconexión y procesa la cola, reintentando cada operación pendiente contra la API en orden FIFO.

---

## 5. Backend — Express + Node.js

### 5.1 Stack y dependencias

**`server/package.json`** — versión `1.0.0`

| Paquete | Versión | Propósito |
|---|---|---|
| `express` | ^4.21.1 | Framework HTTP |
| `typescript` | ^5.7.2 | Tipado estático |
| `tsx` | ^4.19.2 | Ejecución TS en dev (watch mode) |
| `prisma` + `@prisma/client` | ^6.14.0 | ORM + cliente de BD |
| `socket.io` | ^4.8.1 | Servidor WebSocket |
| `jsonwebtoken` | ^9.0.2 | Firma y verificación JWT |
| `bcryptjs` | ^2.4.3 | Hashing de contraseñas |
| `helmet` | ^8.0.0 | Security headers HTTP |
| `cors` | ^2.8.5 | Control de CORS |
| `express-rate-limit` | ^7.4.1 | Limitador de solicitudes |
| `zod` | ^3.23.8 | Validación de esquemas |
| `web-push` | ^3.6.7 | Notificaciones push VAPID |
| `@simplewebauthn/server` | ^13.3.1 | WebAuthn server-side |
| `dotenv` | ^16.4.5 | Variables de entorno |

### 5.2 Punto de entrada y arranque

**`server/src/index.ts`**

```typescript
const server = http.createServer(app)   // HTTP server nativo de Node
createSocketServer(server)              // Socket.IO comparte el mismo servidor

async function main() {
  await prisma.$connect()               // Verifica conexión a PostgreSQL
  server.listen(env.PORT)               // Escucha peticiones
}
```

La arquitectura de un único servidor HTTP permite que Socket.IO y Express compartan puerto, lo cual es esencial para el upgrade WebSocket y para el proxy de Nginx.

### 5.3 Configuración de la aplicación Express

**`server/src/app.ts`**

Orden de middlewares (el orden importa en Express):

1. `app.set('trust proxy', 1)` — necesario en Render/Vercel para que `express-rate-limit` funcione correctamente con `X-Forwarded-For`
2. `helmet(...)` — 15+ headers de seguridad (CSP, HSTS, X-Frame-Options, etc.)
3. `cors({ origin: '*' })` — CORS abierto porque la autenticación es 100% Bearer token, sin cookies
4. `rateLimit` para `/api/auth` — 20 intentos/minuto (anti-fuerza bruta)
5. `rateLimit` para `/api` — 300 solicitudes/minuto (cubre 5+ usuarios simultáneos)
6. `express.json({ limit: '1mb' })` — parsea JSON del body
7. `GET /health` — endpoint de salud para health checks de contenedores
8. Rutas de cada módulo bajo `/api/*`
9. Handler 404
10. `errorHandler` — middleware global de errores

### 5.4 Configuración de entorno (Zod)

**`server/src/config/env.ts`**

Valida todas las variables de entorno al arrancar usando un esquema Zod. Si alguna variable requerida falta o tiene formato incorrecto, el proceso falla con un mensaje claro antes de iniciar el servidor.

| Variable | Tipo | Default | Descripción |
|---|---|---|---|
| `PORT` | number | 3000 | Puerto del servidor |
| `NODE_ENV` | enum | development | Entorno |
| `DATABASE_URL` | string | — | URL completa PostgreSQL |
| `JWT_SECRET` | string (min 16) | — | Secreto para access tokens |
| `JWT_REFRESH_SECRET` | string (min 16) | — | Secreto para refresh tokens |
| `JWT_EXPIRES_IN` | string | 15m | Expiración access token |
| `JWT_REFRESH_EXPIRES_IN` | string | 7d | Expiración refresh token |
| `CORS_ORIGIN` | string | localhost:5173,... | Orígenes permitidos |
| `RATE_LIMIT_WINDOW_MS` | number | 60000 | Ventana rate limit |
| `RATE_LIMIT_MAX_REQUESTS` | number | 300 | Máx requests/ventana (API) |
| `RATE_LIMIT_AUTH_MAX` | number | 20 | Máx requests/ventana (auth) |
| `VAPID_SUBJECT` | string | mailto:... | Email contacto VAPID |
| `VAPID_PUBLIC_KEY` | string? | — | Clave pública VAPID |
| `VAPID_PRIVATE_KEY` | string? | — | Clave privada VAPID |

### 5.5 Módulos del backend

Cada módulo sigue la misma estructura: `*.routes.ts` define los endpoints y llama a `*.service.ts` que contiene la lógica de negocio con Prisma.

#### Módulo auth

**`auth.service.ts`**

`login(document, password)`:
1. Busca usuario por `document` en BD
2. Verifica `user.isActive`
3. Compara contraseña con `bcrypt.compare()`
4. Genera `accessToken` (15m) y `refreshToken` (7d)
5. Retorna `{ user, tokens }`

`register(data)`:
1. Verifica que no exista usuario con el mismo `document`
2. Bloquea registro de rol `administrador` via API
3. Hashea contraseña con bcrypt (10 rounds)
4. Crea usuario con `isActive: false` (el admin lo activa)

`refresh(token)`:
1. Verifica `refreshToken` con `JWT_REFRESH_SECRET`
2. Comprueba que el usuario siga activo
3. Genera nuevo par de tokens

**`face.service.ts`**

`enrollFace(userId, descriptor: number[128])`:
- Almacena el descriptor como JSON string en `User.faceDescriptor`

`verifyFace(document, descriptor)`:
1. Busca usuario por documento
2. Deserializa su `faceDescriptor` almacenado
3. Calcula distancia euclidiana entre descriptores
4. Si distancia < 0.5: login exitoso → retorna tokens
5. Si distancia >= 0.5: lanza error de no coincidencia

**`webauthn.service.ts`**

Implementa el flujo completo de WebAuthn usando `@simplewebauthn/server`:
1. `getRegistrationOptions` → genera challenge para el cliente
2. `verifyRegistration` → valida respuesta, guarda `credentialId` + `publicKey` + `counter`
3. `getAuthenticationOptions` → genera challenge de login
4. `verifyAuthentication` → valida signature, actualiza `counter` anti-replay, retorna tokens

#### Módulo orders

**`orders.service.ts`** — lógica de negocio crítica:

Al **crear un pedido**:
- Calcula `unitPrice` y `subtotal` de cada ítem consultando el precio actual del producto
- Calcula `total` sumando subtotales
- Si `type === 'mesa'`: actualiza `table.status` a `'ocupada'` y `table.currentOrderId`

Al **actualizar estado**:
- `listo` → emite Socket.IO a cajeros/admins
- `pagado` → registra payment, actualiza mesa a `disponible`
- `cancelado` → si tenía mesa, la libera

Al **añadir/remover ítems**:
- Recalcula `total` del pedido automáticamente

#### Módulo deliveries

**`deliveries.service.ts`**:

Al **crear domicilio**: crea un `Order` de tipo `domicilio` y luego crea el `Delivery` asociado.

Al **asignar domiciliario**: actualiza `driverId` y estado a `asignado`, emite evento por Socket.IO al domiciliario específico.

Al **actualizar ubicación** (`updateLocation`): persiste `currentLat` / `currentLng` en BD.

`getAvailableDrivers()`: consulta usuarios con `role: 'domiciliario'` e `isActive: true`.

#### Módulo reports

**`reports.service.ts`** genera `DailySummary`:
```typescript
{
  date: string
  totalOrders: number
  totalRevenue: number
  totalDeliveries: number
  paymentBreakdown: Record<PaymentMethod, number>
  topProducts: { product: Product; quantity: number }[]
  ordersByStatus: Record<OrderStatus, number>
  averageTicket: number
}
```

Usa queries Prisma con `groupBy`, `_sum`, `_count` para agregar datos eficientemente.

### 5.6 Middlewares

**`auth.middleware.ts`** — `requireAuth`
```
1. Extrae header Authorization: Bearer <token>
2. Verifica con verifyAccessToken(token)
3. Si válido: asigna req.user = { id, role, name }
4. Si inválido: responde 401
```

**`role.middleware.ts`** — `requireRole(roles[])`
```
1. Lee req.user.role (puesto por requireAuth)
2. Si el rol está en la lista → next()
3. Si no → 403 Forbidden
```

**`validate.middleware.ts`** — `validate(schema)`
```
1. Ejecuta schema.safeParse(req.body)
2. Si pasa: next()
3. Si falla: responde 400 con errores Zod formateados
```

**`error.middleware.ts`** — handler global
```
1. Captura cualquier error pasado con next(error)
2. Registra en consola
3. Responde 500 con { success: false, message } en JSON
4. En desarrollo: incluye stack trace
```

### 5.7 Servidor Socket.IO

**Archivo:** `server/src/sockets/socket.server.ts`

#### Configuración

```typescript
io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
  transports: ['polling', 'websocket'],  // polling primero, luego upgrade
  pingTimeout:  60_000,   // 60s — Render free puede tardar en responder
  pingInterval: 25_000,   // ping cada 25s
})
```

#### Autenticación del socket

El middleware de Socket.IO extrae `socket.handshake.auth.token`, lo verifica con `verifyAccessToken()` y adjunta el payload `{ sub, role, name }` al socket. Si el token es inválido, la conexión se rechaza antes de establecerse.

#### Rooms

Al conectar, cada socket se une automáticamente a:
- `role:{role}` — ej. `role:cajero` para emitir a todos los cajeros
- `user:{id}` — ej. `user:abc123` para emitir a un usuario específico

#### Eventos del servidor

| Evento | Dirección | Descripción |
|---|---|---|
| `driver:location` | Cliente → Servidor | Domiciliario envía GPS |
| `chat:send` | Cliente → Servidor | Usuario envía mensaje |
| `delivery:location` | Servidor → Clientes | Broadcast ubicación a cajeros/admins |
| `chat:message` | Servidor → Todos | Broadcast mensaje de chat |

El evento `chat:send` persiste el mensaje en `ChatMessage` antes de hacer broadcast, garantizando que el historial esté disponible para usuarios que se conecten después.

El evento `driver:location` persiste `currentLat/currentLng` en el `Delivery` activo del domiciliario vía `updateMany`.

#### Funciones de utilidad exportadas

```typescript
emitToAll(event, payload)           // broadcast a todos los sockets
emitToRoles(roles[], event, payload) // emite a rooms de roles específicos
emitToUser(userId, event, payload)   // emite a la room del usuario
getIO()                              // accede al servidor IO desde otros módulos
```

### 5.8 Utilidades del servidor

**`jwt.ts`**
```typescript
signAccessToken(payload)   → string  // expira en JWT_EXPIRES_IN (15m)
signRefreshToken(payload)  → string  // expira en JWT_REFRESH_EXPIRES_IN (7d)
verifyAccessToken(token)   → JwtPayload
verifyRefreshToken(token)  → JwtPayload
```

**`hash.ts`**
```typescript
hashPassword(plain)          → Promise<string>  // bcrypt, 10 rounds
comparePassword(plain, hash) → Promise<boolean>
```

**`pagination.ts`**
```typescript
getPaginationParams(query)   → { skip, take, page, limit }
buildPaginatedResponse(data, total, page, limit)
  → { data, meta: { total, page, limit, totalPages } }
```

### 5.9 Servicio de Push Notifications (VAPID)

**Archivo:** `server/src/services/push.service.ts`

Usa `web-push` para enviar notificaciones push a dispositivos suscritos incluso cuando la app está cerrada. Requiere claves VAPID generadas previamente.

Flujo:
1. Frontend solicita `GET /api/push/vapid-key` → obtiene la clave pública VAPID
2. Frontend llama `PushManager.subscribe({ userVisibleOnly: true, applicationServerKey })` 
3. Frontend envía la suscripción (`endpoint`, `p256dh`, `auth`) a `POST /api/push/subscribe`
4. Backend guarda en `PushSubscription`
5. Cuando ocurre un evento relevante, el servidor llama `sendPushNotification(subscription, payload)` que usa `web-push.sendNotification()`

---

## 6. Base de Datos — PostgreSQL + Prisma

### 6.1 Esquema completo

**Archivo:** `server/prisma/schema.prisma`

```
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

### 6.2 Enumeraciones

```
enum Role            { mesero | cajero | domiciliario | administrador }
enum TableStatus     { disponible | ocupada | pendiente_pago }
enum ProductCategory { entrada | plato_principal | bebida | postre | especial | domicilio }
enum OrderType       { mesa | domicilio }
enum OrderStatus     { tomado | en_preparacion | listo | entregado | pagado | finalizado | cancelado }
enum PaymentMethod   { efectivo | tarjeta | transferencia | nequi | daviplata }
enum DeliveryStatus  { pendiente | asignado | en_camino | entregado | cancelado }
```

### 6.3 Modelos y relaciones

#### User
```
id            UUID (PK)
name          String
document      String @unique        ← identificador primario de login
email         String? @unique
phone         String?
password      String                ← hash bcrypt
role          Role
isActive      Boolean = true
faceDescriptor String?              ← JSON del vector[128] facial
createdAt     DateTime
updatedAt     DateTime @updatedAt

→ ordersCreated  Order[] via "creator"
→ deliveries     Delivery[] via "driver"
→ payments       Payment[] via "cashier"
→ pushSubscriptions PushSubscription[]
→ webAuthnCredentials WebAuthnCredential[]

@@index([role])
@@index([document])
```

#### Table
```
id             UUID (PK)
number         Int @unique           ← número visible de la mesa
status         TableStatus = disponible
capacity       Int?
zone           String?               ← "Salón principal", "Terraza", etc.
currentOrderId String?               ← ID del pedido activo (denormalizado)

→ orders  Order[]

@@index([status])
```

#### Product
```
id          UUID (PK)
name        String
description String?
price       Float
category    ProductCategory
imageUrl    String?
isAvailable Boolean = true          ← disponible en el menú hoy
isActive    Boolean = true          ← no eliminado del sistema
createdAt   DateTime
updatedAt   DateTime @updatedAt

→ orderItems  OrderItem[]

@@index([category])
@@index([isAvailable])
```

#### Order
```
id        UUID (PK)
type      OrderType = mesa
tableId   String?                   ← null si es domicilio
status    OrderStatus = tomado
total     Float
notes     String?
createdBy String                    ← FK → User.id
createdAt DateTime
updatedAt DateTime @updatedAt

→ table    Table? (via tableId)
→ items    OrderItem[] (CASCADE delete)
→ creator  User (via createdBy)
→ payment  Payment? (1:1)
→ delivery Delivery? (1:1)

@@index([status])
@@index([tableId])
@@index([type])
@@index([createdAt])
```

#### OrderItem
```
id        UUID (PK)
orderId   String                    ← FK → Order.id (CASCADE delete)
productId String                    ← FK → Product.id
quantity  Int
unitPrice Float                     ← precio al momento de crear el ítem
subtotal  Float                     ← quantity × unitPrice
notes     String?

@@index([orderId])
```

#### Payment
```
id             UUID (PK)
orderId        String @unique        ← 1:1 con Order
amount         Float
method         PaymentMethod
receivedAmount Float?               ← para efectivo
change         Float?               ← vuelto
paidAt         DateTime = now()
cashierId      String               ← FK → User.id

@@index([paidAt])
@@index([method])
```

#### Delivery
```
id            UUID (PK)
orderId       String @unique        ← 1:1 con Order
driverId      String?               ← FK → User.id (null = sin asignar)
status        DeliveryStatus = pendiente
street        String
neighborhood  String?
reference     String?
addressLat    Float?                ← coordenadas del destino
addressLng    Float?
currentLat    Float?                ← posición actual del domiciliario
currentLng    Float?
estimatedTime Int?                  ← minutos estimados
customerName  String
customerPhone String
createdAt     DateTime
updatedAt     DateTime @updatedAt

@@index([status])
@@index([driverId])
```

#### ChatMessage
```
id         UUID (PK)
senderId   String                   ← ID del usuario (no FK, puede ser histórico)
senderName String                   ← denormalizado para display rápido
senderRole Role
content    String
createdAt  DateTime = now()

@@index([createdAt])
```

#### PushSubscription
```
id        UUID (PK)
userId    String                    ← FK → User.id (CASCADE delete)
endpoint  String @unique            ← URL del push service del navegador
p256dh    String                    ← clave pública del cliente
auth      String                    ← token de autenticación
createdAt DateTime

@@index([userId])
```

#### WebAuthnCredential
```
id           UUID (PK)
userId       String                 ← FK → User.id (CASCADE delete)
credentialId String @unique         ← ID de la credencial WebAuthn
publicKey    String                 ← clave pública del autenticador
counter      BigInt = 0             ← contador anti-replay
deviceType   String?
transports   String?                ← "usb,nfc,ble,internal"
createdAt    DateTime

@@index([userId])
```

### 6.4 Datos semilla (seed)

**Archivo:** `server/prisma/seed.ts`

Crea usuarios de prueba, mesas y catálogo de productos inicial.

#### Usuarios

| Rol | Documento | Contraseña |
|---|---|---|
| administrador | 123456789 | admin123 |
| mesero | 987654321 | mesero123 |
| cajero | 111222333 | cajero123 |
| domiciliario | 444555666 | domicilio123 |

#### Mesas (6 mesas)

| Número | Capacidad | Zona |
|---|---|---|
| 1–2 | 4 | Salón principal |
| 3–4 | 2 | Terraza |
| 5 | 8 | Privado |
| 6 | 4 | Barra |

#### Productos (18 ítems)

Distribuidos en categorías: entradas, platos principales, bebidas, postres, especiales y domicilio.

---

## 7. API REST — Referencia de Endpoints

Todos los endpoints REST están bajo el prefijo `/api`. Las respuestas siguen el formato:

```json
{ "success": true, "data": { ... } }
{ "success": false, "message": "Descripción del error" }
```

### Autenticación (`/api/auth`)

| Método | Ruta | Auth | Body | Descripción |
|---|---|---|---|---|
| POST | `/login` | No | `{ document, password }` | Login con contraseña |
| POST | `/register` | No | `{ name, document, password, role, ... }` | Registro |
| POST | `/refresh` | No | `{ refreshToken }` | Renovar access token |
| POST | `/logout` | Sí | — | Cerrar sesión |
| GET | `/me` | Sí | — | Perfil del usuario autenticado |
| POST | `/face/enroll` | Sí | `{ descriptor: number[] }` | Registrar descriptor facial |
| POST | `/face/verify` | No | `{ document, descriptor }` | Login por reconocimiento facial |
| GET | `/face/has-descriptor` | Sí | — | ¿Tiene cara registrada? |
| POST | `/webauthn/register-options` | Sí | — | Opciones para registrar credencial |
| POST | `/webauthn/register-verify` | Sí | RegistrationResponseJSON | Verificar registro biométrico |
| POST | `/webauthn/login-options` | No | `{ document }` | Challenge de login biométrico |
| POST | `/webauthn/login-verify` | No | `{ userId, response }` | Verificar login biométrico |
| GET | `/webauthn/has-credential` | Sí | — | ¿Tiene credencial WebAuthn? |

### Usuarios (`/api/users`) — solo admin

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/` | Admin | Listar usuarios (paginado) |
| GET | `/:id` | Admin | Obtener usuario |
| POST | `/` | Admin | Crear usuario |
| PUT | `/:id` | Admin | Actualizar usuario |
| PATCH | `/:id/toggle-active` | Admin | Activar/desactivar |
| PATCH | `/:id/reset-password` | Admin | Restablecer contraseña |

### Mesas (`/api/tables`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/` | Sí | Listar todas las mesas |
| GET | `/:id` | Sí | Obtener mesa por ID |
| POST | `/` | Admin | Crear mesa |
| PUT | `/:id` | Admin | Actualizar mesa |
| PATCH | `/:id/status` | Cajero/Admin | Cambiar estado |
| DELETE | `/:id` | Admin | Eliminar mesa |

### Productos (`/api/products`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/` | Sí | Listar productos (filtrable por `category`, `available`) |
| GET | `/:id` | Sí | Obtener producto |
| POST | `/` | Admin | Crear producto |
| PUT | `/:id` | Admin | Actualizar producto |
| PATCH | `/:id/availability` | Admin | Toggle disponibilidad |
| DELETE | `/:id` | Admin | Eliminar producto |

### Pedidos (`/api/orders`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/` | Sí | Listar pedidos (filtrable por `status`, `type`) |
| GET | `/:id` | Sí | Obtener pedido con ítems |
| POST | `/` | Mesero/Admin | Crear pedido |
| PATCH | `/:id/status` | Sí | Cambiar estado |
| POST | `/:id/items` | Mesero/Admin | Añadir ítem |
| DELETE | `/:id/items/:itemId` | Mesero/Admin | Remover ítem |
| PATCH | `/:id/cancel` | Sí | Cancelar pedido |

### Pagos (`/api/payments`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/` | Cajero/Admin | Procesar pago |
| GET | `/history` | Cajero/Admin | Historial de pagos |
| GET | `/daily-report` | Cajero/Admin | Reporte del día (`?date=YYYY-MM-DD`) |

### Domicilios (`/api/deliveries`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/` | Cajero/Admin | Listar domicilios |
| GET | `/my` | Domiciliario | Mis domicilios asignados |
| GET | `/drivers/available` | Cajero/Admin | Domiciliarios disponibles |
| GET | `/:id` | Sí | Obtener domicilio |
| POST | `/` | Cajero/Admin | Crear domicilio |
| PATCH | `/:id/assign` | Cajero/Admin | Asignar domiciliario |
| PATCH | `/:id/status` | Sí | Actualizar estado |
| PATCH | `/:id/location` | Domiciliario | Actualizar ubicación GPS |

### Reportes (`/api/reports`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/daily` | Cajero/Admin | Resumen del día |
| GET | `/period` | Admin | Resumen por período (`?from=&to=`) |

### Chat (`/api/chat`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/history` | Sí | Últimos N mensajes (`?limit=100`) |

### Push Notifications (`/api/push`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/vapid-key` | No | Clave pública VAPID |
| POST | `/subscribe` | Sí | Registrar suscripción push |

### Salud

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/health` | No | Estado del servidor |

---

## 8. Eventos WebSocket

La conexión Socket.IO requiere el `accessToken` JWT en el handshake:

```javascript
io(SOCKET_URL, { auth: { token: accessToken } })
```

### Eventos emitidos por el cliente

| Evento | Payload | Quién lo emite | Descripción |
|---|---|---|---|
| `driver:location` | `{ lat, lng, timestamp }` | Domiciliario | Actualización GPS |
| `chat:send` | `{ content, clientId? }` | Cualquier rol | Enviar mensaje |

`clientId` es un UUID generado en el cliente para deduplicar el mensaje optimista vs el echo del servidor.

### Eventos emitidos por el servidor

| Evento | Payload | A quién | Descripción |
|---|---|---|---|
| `delivery:location` | `{ driverId, lat, lng, timestamp }` | `role:cajero` + `role:administrador` + domiciliario | Posición GPS actualizada |
| `chat:message` | `{ message: ChatMessage }` | Todos los conectados | Nuevo mensaje de chat |

### Rooms y destinatarios

| Room | Miembros |
|---|---|
| `role:mesero` | Todos los meseros conectados |
| `role:cajero` | Todos los cajeros conectados |
| `role:domiciliario` | Todos los domiciliarios conectados |
| `role:administrador` | Todos los admins conectados |
| `user:{id}` | Un usuario específico |

---

## 9. Autenticación y Seguridad

### 9.1 JWT

El sistema usa dos tokens:

**Access Token** (`JWT_SECRET`, expira en 15 minutos)
- Se incluye en cada petición HTTP: `Authorization: Bearer <token>`
- Se pasa en el handshake de Socket.IO: `auth.token`
- Payload: `{ sub: userId, role, name, iat, exp }`

**Refresh Token** (`JWT_REFRESH_SECRET`, expira en 7 días)
- Se usa solo en `POST /api/auth/refresh`
- Permite obtener un nuevo access token sin hacer login de nuevo

**Flujo de renovación automática:**
El cliente HTTP del frontend detecta respuesta 401, llama automáticamente a `/api/auth/refresh`, actualiza el token en el store y reintenta la petición original. Si el refresh también falla, redirige a `/login`.

### 9.2 Reconocimiento facial (Face-API)

**Librería:** `@vladmandic/face-api` (wrapper moderno de face-api.js sobre TensorFlow.js)

**Flujo de enrollment:**
1. Usuario autenticado por contraseña abre la sección de registro facial en su perfil
2. Se activa la cámara (`getUserMedia`)
3. `face-api` detecta el rostro y extrae un descriptor vectorial de 128 dimensiones
4. El descriptor `number[128]` se envía a `POST /api/auth/face/enroll`
5. El backend lo serializa como JSON y lo guarda en `User.faceDescriptor`

**Flujo de login:**
1. Usuario introduce su número de documento
2. Se activa la cámara y se captura el descriptor en tiempo real
3. Se envía `{ document, descriptor }` a `POST /api/auth/face/verify`
4. El backend carga el descriptor almacenado y calcula la distancia euclidiana
5. Si `dist < 0.5`: autenticado → retorna tokens JWT
6. Si `dist ≥ 0.5`: rechazado

### 9.3 WebAuthn — biometría del SO

**Librería servidor:** `@simplewebauthn/server` v13  
**Librería cliente:** `@simplewebauthn/browser` v13

Permite usar la biometría nativa del dispositivo (Touch ID, Face ID, Windows Hello, lector de huellas) como método de autenticación. Funciona a nivel del SO, sin que las credenciales biométricas salgan nunca del dispositivo.

**Flujo de registro (una vez por dispositivo):**
1. `POST /api/auth/webauthn/register-options` → servidor genera challenge
2. Cliente llama `startRegistration(options)` → SO pide biometría al usuario
3. `POST /api/auth/webauthn/register-verify` → servidor verifica y guarda `credentialId` + `publicKey`

**Flujo de login:**
1. `POST /api/auth/webauthn/login-options` → servidor genera challenge con credenciales del usuario
2. Cliente llama `startAuthentication(options)` → SO verifica biometría localmente
3. `POST /api/auth/webauthn/login-verify` → servidor verifica firma, actualiza `counter` (anti-replay), retorna JWT

### 9.4 Seguridad HTTP

| Medida | Implementación | Detalle |
|---|---|---|
| Security headers | `helmet` v8 | CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy |
| CORS | `cors` + Bearer token | `origin: '*'` es seguro porque no usa cookies; la auth es 100% Bearer |
| Rate limiting general | `express-rate-limit` | 300 req/min/IP para toda la API |
| Rate limiting auth | `express-rate-limit` | 20 req/min/IP en `/api/auth` (anti-brute-force) |
| SQL Injection | Prisma ORM | Consultas parametrizadas, sin SQL raw |
| Contraseñas | bcryptjs | Hash con 10 rounds de salt |
| Variables sensibles | dotenv + Zod | Nunca en código, validadas al arrancar |
| Tokens en body | JSON | Sin cookies → inmune a CSRF |

---

## 10. Infraestructura y Despliegue

### 10.1 Docker Compose — desarrollo local

**Archivo:** `docker-compose.yml`

Orquesta tres servicios que se comunican en la red Docker interna:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: sazon_uvitano
    ports: ["5432:5432"]
    volumes: [pgdata:/var/lib/postgresql/data]
    healthcheck:
      test: pg_isready -U postgres
      interval: 5s  retries: 10

  backend:
    build: server/Dockerfile
    depends_on: { postgres: { condition: service_healthy } }
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/sazon_uvitano
      PORT: 3000
    ports: ["3000:3000"]
    restart: unless-stopped

  frontend:
    build: frontend/Dockerfile
    depends_on: [backend]
    ports: ["8080:80"]
    restart: unless-stopped
```

El backend espera a que PostgreSQL esté listo (`service_healthy`) antes de arrancar. El frontend (Nginx) recibe el tráfico en puerto 8080 y hace proxy al backend internamente.

### 10.2 Nginx — proxy inverso y servidor estático

**Archivo:** `frontend/nginx.conf`

```nginx
server {
  listen 80;
  root /usr/share/nginx/html;
  gzip on;
  gzip_types text/plain application/javascript application/json text/css;

  # SPA routing — todas las rutas → index.html
  location / {
    try_files $uri $uri/ /index.html;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
  }

  # Caché agresivo para assets con hash en el nombre (1 año, immutable)
  location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2|webp)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

  # Proxy REST API
  location /api/ {
    proxy_pass http://backend:3000/api/;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_read_timeout 60s;
  }

  # Proxy WebSocket con upgrade
  location /socket.io/ {
    proxy_pass http://backend:3000/socket.io/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_read_timeout 86400s;  # 24h — conexiones WS persistentes
  }
}
```

La estrategia de caché diferencia entre:
- **`index.html`** — sin caché (`no-cache`) para que el SW detecte updates
- **Assets con hash** — caché máximo (1 año, `immutable`) porque el hash garantiza unicidad
- **API y WS** — sin caché, proxied al backend

### 10.3 Dockerfiles

#### Frontend — `frontend/Dockerfile`

Build multi-stage para imagen mínima en producción:

```dockerfile
# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY frontend/package*.json .
RUN npm ci
COPY frontend/ .
ARG VITE_API_URL=""
ARG VITE_SOCKET_URL=""
RUN npm run build          # genera dist/

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
# Copiar imágenes de Leaflet (tiles, markers)
EXPOSE 80
```

Las variables `VITE_API_URL` y `VITE_SOCKET_URL` se inyectan en tiempo de build como `ARG`, no en runtime, porque Vite las incrusta en el bundle JavaScript.

#### Backend — `server/Dockerfile`

```dockerfile
# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY server/package*.json server/tsconfig.json .
RUN npm ci
COPY server/ .
RUN npm run build          # prisma generate + tsc

# Stage 2: Run
FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY server/prisma ./prisma
# Entrypoint: prisma db push + seed + node dist/index.js
EXPOSE 3000
```

### 10.4 Despliegue en producción (Vercel + Render + Neon)

Arquitectura de producción con servicios gratuitos:

```
Internet → Vercel (frontend)
              ↕ HTTPS / WSS
           Render.com (backend Express)
              ↕ Prisma
           Neon (PostgreSQL serverless)
```

**Neon** — PostgreSQL serverless gratuito. Proporciona una `DATABASE_URL` con SSL incluido.

**Render.com** — Hosting de Node.js con free tier. El servicio puede entrar en modo sleep tras 15 minutos de inactividad (cold start de ~30s).

**Vercel** — CDN global para el frontend estático. Detección automática de `vite.config.ts`, build y deploy en cada push a `main`.

#### Variables de entorno en Render (backend)

```
NODE_ENV=production
PORT=3000
DATABASE_URL=<Neon connection string>
JWT_SECRET=<mínimo 32 caracteres aleatorios>
JWT_REFRESH_SECRET=<mínimo 32 caracteres, diferente al anterior>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=https://tu-app.vercel.app
VAPID_SUBJECT=mailto:tu@email.com
VAPID_PUBLIC_KEY=<generado con web-push generate-vapid-keys>
VAPID_PRIVATE_KEY=<generado con web-push generate-vapid-keys>
```

#### Variables de entorno en Vercel (frontend)

```
VITE_API_URL=https://tu-backend.onrender.com
VITE_SOCKET_URL=https://tu-backend.onrender.com
```

### 10.5 CI/CD — GitHub Actions

**Archivo:** `.github/workflows/ci.yml`

Se ejecuta en:
- Push a `main` o `master`
- Pull Requests hacia `main`

Pasos del pipeline:
1. Checkout del repositorio
2. Setup Node.js 22 con caché de npm
3. `npm ci` en `frontend/` + build TypeScript + Vite
4. `npm ci` en `server/` + generación de cliente Prisma + build TypeScript
5. Si ambos builds pasan: CI exitoso

No hay despliegue automático desde CI — Vercel y Render tienen webhooks propios a GitHub.

---

## 11. Flujos de Datos Principales

### Flujo: Mesero crea un pedido de mesa

```
1. Mesero abre /mesas → MesasPage obtiene tablas via GET /api/tables
2. Selecciona mesa "ocupada" con pedido activo → navega /mesas/:id
3. Tap "Nuevo pedido" → navega /pedidos/nuevo?tableId=<id>
4. MenuCatalog muestra productos via GET /api/products?available=true
5. Mesero añade ítems al OrderCart (estado local React)
6. Confirma: POST /api/orders { type:'mesa', tableId, items[] }
   Backend:
     a. Calcula unitPrice de cada ítem consultando Product
     b. Calcula subtotales y total
     c. Crea Order + OrderItems en transacción
     d. Actualiza Table.status='ocupada' y Table.currentOrderId
7. Response incluye Order completa con items expandidos
8. Store: setActiveOrder(order), updateTable(tableId, { status: 'ocupada' })
9. Navega a /pedidos/:id (PedidoDetallePage)
```

### Flujo: Cajero procesa un pago

```
1. Cajero en /caja → lista pedidos con status 'listo' o 'entregado'
2. Selecciona pedido → CobroModal muestra total
3. Elige método de pago + ingresa monto recibido (si efectivo)
4. Confirma: POST /api/payments { orderId, method, amount, receivedAmount }
   Backend:
     a. Crea Payment en BD
     b. Actualiza Order.status = 'pagado'
     c. Actualiza Table.status = 'disponible', Table.currentOrderId = null
     d. Emite evento Socket.IO a todos: mesa disponible
5. Socket.IO client recibe el evento y actualiza store.tables
6. MesasPage y MesaCard se re-renderizan automáticamente (Zustand reactivo)
```

### Flujo: Rastreo GPS de domiciliario

```
1. Domiciliario abre /mis-entregas → entrega asignada visible
2. Cambia estado a 'en_camino' via PATCH /api/deliveries/:id/status
3. Hook useGPS activa navigator.geolocation.watchPosition()
4. Cada cambio de posición:
   a. Emite socket 'driver:location' { lat, lng, timestamp }
   b. Socket.IO server persiste en Delivery.currentLat/Lng
   c. Emite 'delivery:location' a role:cajero + role:administrador
5. Cajero en /mapa:
   a. DeliveryMap recibe evento 'delivery:location' del socket
   b. store.updateDriverLocation({ driverId, lat, lng })
   c. Leaflet marker se mueve al nuevo punto (sin re-renderizado del mapa)
```

### Flujo: Autenticación facial

```
1. Usuario en LoginPage tab "Cámara"
2. Introduce su número de documento
3. Se activa la cámara (getUserMedia)
4. face-api.js:
   a. Carga modelos TinyFaceDetector + FaceLandmark68Net + FaceRecognitionNet
   b. Detecta rostro en el video stream
   c. Extrae descriptor float32[128]
5. POST /api/auth/face/verify { document, descriptor: Array.from(descriptor) }
6. Backend:
   a. Busca User por document
   b. Deserializa User.faceDescriptor (guardado como JSON)
   c. Calcula distancia euclidiana: √Σ(d1[i]-d2[i])²
   d. Si dist < 0.5 → genera tokens JWT → responde AuthResponse
7. Frontend: setUser(user, accessToken), navega /dashboard
```

---

## 12. Variables de Entorno

### Frontend (`frontend/.env`)

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_API_URL` | URL base del backend | `http://localhost:3000` |
| `VITE_SOCKET_URL` | URL para Socket.IO | `http://localhost:3000` |

Las variables de Vite deben comenzar con `VITE_` para ser accesibles en el bundle. Se inyectan en tiempo de build.

### Backend (`server/.env`)

| Variable | Requerida | Descripción |
|---|---|---|
| `PORT` | No (def. 3000) | Puerto del servidor |
| `NODE_ENV` | No | `development` / `production` |
| `DATABASE_URL` | **Sí** | URL completa PostgreSQL con credenciales |
| `JWT_SECRET` | **Sí** | Secreto access token (mín. 16 chars) |
| `JWT_REFRESH_SECRET` | **Sí** | Secreto refresh token (diferente al anterior) |
| `JWT_EXPIRES_IN` | No (15m) | Expiración access token |
| `JWT_REFRESH_EXPIRES_IN` | No (7d) | Expiración refresh token |
| `CORS_ORIGIN` | No | Orígenes permitidos |
| `RATE_LIMIT_WINDOW_MS` | No (60000) | Ventana rate limit en ms |
| `RATE_LIMIT_MAX_REQUESTS` | No (300) | Máx req/ventana API general |
| `RATE_LIMIT_AUTH_MAX` | No (20) | Máx req/ventana auth |
| `VAPID_SUBJECT` | No | Email VAPID (`mailto:...`) |
| `VAPID_PUBLIC_KEY` | No* | Clave pública VAPID para push |
| `VAPID_PRIVATE_KEY` | No* | Clave privada VAPID para push |

*Requeridas para que funcionen las notificaciones push. Generadas con: `npx web-push generate-vapid-keys`

---

## 13. Comandos de Desarrollo

### Frontend

```bash
# Instalar dependencias
cd frontend && npm install

# Servidor de desarrollo con HMR
npm run dev            # http://localhost:5173

# Build de producción
npm run build          # genera frontend/dist/

# Lint
npm run lint

# Vista previa del build
npm run preview
```

### Backend

```bash
# Instalar dependencias
cd server && npm install

# Generar cliente Prisma (necesario tras cambios en schema.prisma)
npm run prisma:generate

# Crear/aplicar migraciones (desarrollo)
npm run prisma:migrate

# Aplicar schema sin migraciones (producción / Render)
npx prisma db push

# Poblar BD con datos iniciales
npm run prisma:seed

# Setup completo (push + seed)
npm run setup

# Servidor de desarrollo con hot reload
npm run dev            # http://localhost:3000

# Build de producción
npm run build          # genera server/dist/

# Ejecutar en producción
npm run start
```

### Docker Compose

```bash
# Levantar entorno completo (postgres + backend + frontend)
docker compose up --build

# Solo BD
docker compose up postgres -d

# Ver logs del backend
docker compose logs backend -f

# Detener y limpiar
docker compose down

# Detener y eliminar volúmenes (borra la BD)
docker compose down -v
```

### Utilidades

```bash
# Generar claves VAPID para push notifications
npx web-push generate-vapid-keys

# Ver schema de la BD en Prisma Studio
npx prisma studio

# Verificar salud del backend
curl http://localhost:3000/health
```

---

## Paleta de Colores

| Token | Hex | Uso |
|---|---|---|
| Brand primary | `#5F290F` | TopBar, botones principales, theme-color |
| Brand secondary | `#C45E21` | Acentos, hover states |
| Accent gold | `#CF9E55` | Highlights, iconos especiales |
| Background | `#FEFEFE` | Fondo general cálido |

## Convenciones del Código

- **Módulos en barril:** todos los componentes usan `export default`. Los archivos `index.ts` de barril usan `export { default as X } from './X'`.
- **Zustand selectors:** por limitación de tipos en Zustand v5 con `persist`, los selectores requieren cast explícito: `useAppStore((s) => (s as AppStore).user)`.
- **TailwindCSS v4:** usa sintaxis nueva — `bg-linear-to-r` (no `bg-gradient-to-r`), `min-h-12` en vez de `min-h-[48px]`.
- **Express params:** tipados como `req.params['id'] as string` por el tipado de Express 5 que retorna `string | string[]`.
- **Enums Prisma:** solo disponibles en el cliente tras ejecutar `prisma generate`.
