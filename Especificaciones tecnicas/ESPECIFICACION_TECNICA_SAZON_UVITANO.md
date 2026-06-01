# ESPECIFICACIÓN TÉCNICA COMPLETA
# PWA El Sazón Uvitano — Sistema de Gestión Operativa para Restaurante

**Versión:** 2.0  
**Estado:** Producción  
**Fecha:** 2025  
**Arquitectura:** PWA Enterprise Modular — Mobile First  
**Modelo:** Tiempo real + Offline First Parcial  

---

## TABLA DE CONTENIDOS

1. [Visión General](#1-visión-general)
2. [Objetivos del Sistema](#2-objetivos-del-sistema)
3. [Alcance del Proyecto](#3-alcance-del-proyecto)
4. [Arquitectura General](#4-arquitectura-general)
5. [Stack Tecnológico Oficial](#5-stack-tecnológico-oficial)
6. [Diseño Visual y Paleta Oficial](#6-diseño-visual-y-paleta-oficial)
7. [Estructura de Roles y Permisos](#7-estructura-de-roles-y-permisos)
8. [Módulos y Pantallas del Sistema](#8-módulos-y-pantallas-del-sistema)
9. [Flujos Operativos Completos](#9-flujos-operativos-completos)
10. [Estructura de Carpetas Frontend](#10-estructura-de-carpetas-frontend)
11. [Tipos TypeScript del Sistema](#11-tipos-typescript-del-sistema)
12. [Estado Global — Zustand Store](#12-estado-global--zustand-store)
13. [Rutas y Guards de Autenticación](#13-rutas-y-guards-de-autenticación)
14. [Servicios API — Contrato Frontend](#14-servicios-api--contrato-frontend)
15. [Contrato Backend Completo](#15-contrato-backend-completo)
16. [Base de Datos — Esquema Prisma](#16-base-de-datos--esquema-prisma)
17. [WebSockets — Eventos en Tiempo Real](#17-websockets--eventos-en-tiempo-real)
18. [Sistema GPS](#18-sistema-gps)
19. [Chat Interno](#19-chat-interno)
20. [Especificación PWA Completa](#20-especificación-pwa-completa)
21. [IndexedDB — Offline Parcial](#21-indexeddb--offline-parcial)
22. [Notificaciones Push — FCM](#22-notificaciones-push--fcm)
23. [Constantes y Configuraciones UI](#23-constantes-y-configuraciones-ui)
24. [Validaciones — Zod Schemas](#24-validaciones--zod-schemas)
25. [Hooks Reutilizables](#25-hooks-reutilizables)
26. [Estructura de Carpetas Backend](#26-estructura-de-carpetas-backend)
27. [Seguridad](#27-seguridad)
28. [Estándares de Calidad — Lighthouse](#28-estándares-de-calidad--lighthouse)
29. [Logging y Monitoreo](#29-logging-y-monitoreo)
30. [Testing](#30-testing)
31. [CI/CD Pipeline](#31-cicd-pipeline)
32. [Contenerización Docker](#32-contenerización-docker)
33. [Deploy Productivo](#33-deploy-productivo)
34. [Variables de Entorno](#34-variables-de-entorno)
35. [Backups y Disponibilidad](#35-backups-y-disponibilidad)
36. [Estándares de Código](#36-estándares-de-código)
37. [Accesibilidad](#37-accesibilidad)
38. [Criterios de Aceptación](#38-criterios-de-aceptación)

---

## 1. VISIÓN GENERAL

### 1.1 Nombre del sistema

**El Sazón Uvitano** — Plataforma PWA de Gestión Operativa para Restaurante.

### 1.2 Descripción general

Sistema integral de gestión operativa para el restaurante El Sazón Uvitano, implementado como Progressive Web App (PWA) instalable, con funcionamiento en tiempo real, offline parcial y seguimiento GPS de domiciliarios.

La plataforma centraliza:

- Gestión de mesas y estados de ocupación
- Registro y seguimiento de pedidos por estados
- Control de caja, cobros y métodos de pago
- Gestión de domicilios con asignación de repartidores
- Seguimiento GPS en tiempo real por mapa interactivo
- Comunicación interna por chat entre roles
- Reportes operativos diarios y por rango de fechas
- Notificaciones push por eventos del sistema
- Funcionamiento offline parcial con sincronización automática
- Control administrativo completo: usuarios, productos, mesas y menú

### 1.3 Usuarios del sistema

| Rol | Descripción | Acceso principal |
|-----|-------------|-----------------|
| Mesero | Operador de sala | Mesas y toma de pedidos |
| Cajero | Operador de caja | Pedidos, cobros y domicilios |
| Domiciliario | Repartidor | Sus entregas y GPS |
| Administrador | Dueño / Gerente | Acceso completo + admin |

---

## 2. OBJETIVOS DEL SISTEMA

### 2.1 Objetivo general

Desarrollar una PWA robusta, escalable y segura para gestionar la operación completa del restaurante mediante flujos en tiempo real, sincronización offline parcial y monitoreo GPS de domiciliarios.

### 2.2 Objetivos específicos

- Centralizar y digitalizar la operación completa del restaurante
- Reducir errores humanos en la toma y entrega de pedidos
- Mejorar los tiempos de atención en sala y domicilio
- Digitalizar el proceso de caja con múltiples métodos de pago
- Implementar monitoreo GPS en tiempo real de domiciliarios
- Permitir funcionamiento parcial sin conexión a internet
- Implementar arquitectura escalable orientada a producción
- Cumplir estándares modernos de PWA productiva (Lighthouse 90+)
- Proveer acceso por roles con seguridad JWT

---

## 3. ALCANCE DEL PROYECTO

### Incluye

- Sistema de autenticación con JWT y refresh token
- Gestión completa de usuarios por el administrador
- Gestión de mesas con estados y zonas
- Gestión de pedidos con catálogo de productos por categorías
- Gestión de caja con múltiples métodos de pago y cierre diario
- Módulo de domicilios con asignación de repartidores
- Seguimiento GPS en tiempo real con mapa Leaflet
- Chat interno en tiempo real entre todos los roles
- Notificaciones push por eventos operativos
- Reportes diarios y por rango de fechas
- Panel de administración: usuarios, productos, mesas
- IndexedDB para funcionamiento offline parcial
- Service Worker con Workbox
- Deploy productivo con Docker + Nginx + HTTPS

### No incluye (v1.0)

- Facturación electrónica DIAN
- Pasarela de pagos online (PSE, Wompi, etc.)
- Multi-sede
- Inteligencia artificial
- Integraciones con ERP externo
- Inventario avanzado de insumos
- Contabilidad integrada

---

## 4. ARQUITECTURA GENERAL

### 4.1 Diagrama de arquitectura

```
┌─────────────────────────────────────────────────────┐
│                   CLIENTE PWA                        │
│                                                      │
│  React 19 + TypeScript + Vite + TailwindCSS         │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ Zustand  │  │  TanStack│  │  Socket.IO Client│  │
│  │  Store   │  │  Query   │  │  (tiempo real)   │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
│  ┌──────────────────────────────────────────────┐   │
│  │           Service Worker (Workbox)           │   │
│  │  Cache First │ Network First │ SWR           │   │
│  └──────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────┐   │
│  │           IndexedDB (Dexie.js)               │   │
│  │  Sesión │ Menú │ Pedidos temp │ Cola offline │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                         │
                    HTTPS + WSS
                         │
┌─────────────────────────────────────────────────────┐
│                  CLOUDFLARE CDN                       │
└─────────────────────────────────────────────────────┘
                         │
┌─────────────────────────────────────────────────────┐
│                   NGINX SERVER                        │
│         Reverse Proxy + SSL + Compression             │
└─────────────────────────────────────────────────────┘
                         │
          ┌──────────────┴──────────────┐
          │                             │
┌─────────────────┐          ┌─────────────────────┐
│  Frontend React  │          │   Backend Express    │
│  (Static files) │          │   Node.js + TypeScript│
│                 │          │                       │
│                 │          │  ┌─────────────────┐  │
│                 │          │  │  Socket.IO Server│  │
│                 │          │  └─────────────────┘  │
│                 │          │  ┌─────────────────┐  │
│                 │          │  │  Prisma ORM     │  │
│                 │          │  └─────────────────┘  │
└─────────────────┘          └─────────────────────┘
                                        │
                             ┌─────────────────────┐
                             │    PostgreSQL DB     │
                             └─────────────────────┘
```

### 4.2 Flujo de datos

```
Usuario PWA
    ↓ acción
TanStack Query / Socket emit
    ↓ HTTP REST / WebSocket
API Gateway Express
    ↓ middleware auth + rol
Módulo de negocio
    ↓ Prisma ORM
PostgreSQL
    ↑ respuesta
Socket.IO broadcast → todos los clientes conectados
    ↑ actualización reactiva
Zustand store → UI se actualiza
```

---

## 5. STACK TECNOLÓGICO OFICIAL

### Frontend

| Área | Tecnología | Versión |
|------|------------|---------|
| Framework UI | React | 19.x |
| Build tool | Vite | 5.x |
| Lenguaje | TypeScript | 5.x |
| Estilos | TailwindCSS | 3.x |
| Estado global | Zustand | 4.x |
| Fetching / Cache | TanStack Query | 5.x |
| Routing | React Router | 6.x |
| Tiempo real | Socket.IO client | 4.x |
| Mapas | Leaflet + react-leaflet | 1.9.x |
| Tiles mapa | OpenStreetMap | — |
| PWA | Vite PWA Plugin + Workbox | 0.17.x |
| Offline DB | Dexie.js (IndexedDB) | 3.x |
| Push notifications | Firebase Cloud Messaging | 10.x |
| Validaciones | Zod | 3.x |
| Formularios | React Hook Form | 7.x |
| Fuentes | Google Fonts (Poppins + Inter) | — |

### Backend

| Área | Tecnología | Versión |
|------|------------|---------|
| Runtime | Node.js | 20 LTS |
| Framework | Express.js | 4.x |
| Lenguaje | TypeScript | 5.x |
| ORM | Prisma | 5.x |
| Base de datos | PostgreSQL | 16.x |
| Tiempo real | Socket.IO server | 4.x |
| Autenticación | JWT (jsonwebtoken) | 9.x |
| Hashing | bcryptjs | 2.x |
| Validaciones | Zod | 3.x |
| Logs | Winston | 3.x |
| Seguridad | Helmet + CORS + rate-limit | — |

### Infraestructura

| Área | Tecnología |
|------|------------|
| Contenedores | Docker + Docker Compose |
| Proxy inverso | Nginx |
| SSL/TLS | Let's Encrypt (Certbot) |
| CDN / Proxy | Cloudflare |
| CI/CD | GitHub Actions |
| Servidor prod | Ubuntu 24.04 LTS VPS |
| Testing unit | Vitest |
| Testing E2E | Playwright |
| Linting | ESLint + Prettier |
| Git hooks | Husky + lint-staged |

---

## 6. DISEÑO VISUAL Y PALETA OFICIAL

### 6.1 Paleta de colores

Extraída del logo oficial de El Sazón Uvitano:

| Nombre | HEX | Uso |
|--------|-----|-----|
| Marrón profundo | `#5F290F` | Color primario, botones principales, acentos clave |
| Terracota | `#C45E21` | Color secundario activo, estados destacados |
| Dorado tostado | `#CF9E55` | Badges, highlights, detalles decorativos |
| Beige crema | `#E8C27C` | Fondos cálidos, cards de estadísticas |
| Café medio | `#8F5B2A` | Complementario, textos sobre fondos claros |
| Blanco cálido | `#FEFEFE` | Fondo principal de la aplicación |

### 6.2 Paleta Tailwind extendida

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fdf8f5',
          100: '#faeee4',
          200: '#f3d4bb',
          300: '#e8b48a',
          400: '#d98c55',
          500: '#c45e21',  // terracota
          600: '#a34d1a',
          700: '#8f5b2a',  // café medio
          800: '#7a4422',
          900: '#5f290f',  // marrón profundo
          950: '#3d1808',
        }
      }
    }
  }
}
```

### 6.3 Tipografía

| Tipo | Fuente | Uso |
|------|--------|-----|
| Principal | Poppins | Títulos, headers, branding |
| Secundaria | Inter | Cuerpo de texto, labels, UI |
| Monospace | Fira Code / system-mono | IDs, códigos, datos técnicos |

### 6.4 Principios de diseño UI

- **Mobile First:** Diseñado para pantalla de 390px de ancho
- **Touch targets:** Mínimo 44×44px en todos los elementos interactivos
- **Botones primarios:** min-height 52px, border-radius 16px (rounded-2xl)
- **Feedback táctil:** `active:scale-95` en todos los botones
- **Sin hover:** No se depende de hover como interacción principal
- **Inputs:** min-height 48px, border-radius 12px (rounded-xl)
- **Cards:** border-radius 16px (rounded-2xl), sombras mínimas
- **Spacing:** Sistema de 4px (gap-1 = 4px ... gap-6 = 24px)
- **Elevaciones:** Sombras solo en elementos flotantes (modales, FAB)
- **Animaciones:** Transiciones ligeras 150–200ms, sin animaciones pesadas

### 6.5 Estados de color por entidad

#### Mesa
| Estado | Color fondo | Color texto | Punto |
|--------|-------------|-------------|-------|
| Disponible | `bg-green-50` | `text-green-700` | `bg-green-400` |
| Ocupada | `bg-orange-50` | `text-orange-700` | `bg-orange-400` |
| Pendiente pago | `bg-amber-50` | `text-amber-700` | `bg-amber-400` |

#### Pedido
| Estado | Color fondo | Color texto |
|--------|-------------|-------------|
| Tomado | `bg-stone-100` | `text-stone-700` |
| En preparación | `bg-orange-100` | `text-orange-700` |
| Listo | `bg-green-100` | `text-green-700` |
| Entregado | `bg-blue-100` | `text-blue-700` |
| Pagado | `bg-emerald-100` | `text-emerald-700` |
| Finalizado | `bg-stone-200` | `text-stone-600` |
| Cancelado | `bg-red-100` | `text-red-700` |

#### Domicilio
| Estado | Color | Ícono |
|--------|-------|-------|
| Pendiente | `bg-stone-100 text-stone-700` | ⏳ |
| Asignado | `bg-blue-100 text-blue-700` | 👤 |
| En camino | `bg-orange-100 text-orange-700` | 🛵 |
| Entregado | `bg-green-100 text-green-700` | ✅ |
| Cancelado | `bg-red-100 text-red-700` | ❌ |

#### Rol de usuario
| Rol | Color fondo | Color texto | Ícono |
|-----|-------------|-------------|-------|
| Administrador | `bg-amber-100` | `text-amber-800` | ⚙️ |
| Cajero | `bg-green-100` | `text-green-800` | 💳 |
| Mesero | `bg-orange-100` | `text-orange-800` | 🍽️ |
| Domiciliario | `bg-blue-100` | `text-blue-800` | 🛵 |

---

## 7. ESTRUCTURA DE ROLES Y PERMISOS

### 7.1 Definición de roles

```typescript
type Role = 'administrador' | 'cajero' | 'mesero' | 'domiciliario'
```

### 7.2 Matriz de acceso a pantallas

| Ruta | Mesero | Cajero | Domiciliario | Administrador |
|------|--------|--------|--------------|---------------|
| `/login` | ✅ | ✅ | ✅ | ✅ |
| `/dashboard` | ✅ | ✅ | ✅ | ✅ |
| `/mesas` | ✅ | ✅ | ❌ | ✅ |
| `/mesas/:id` | ✅ | ✅ | ❌ | ✅ |
| `/pedidos/nuevo` | ✅ | ❌ | ❌ | ✅ |
| `/pedidos/:id` | ✅ | ✅ | ❌ | ✅ |
| `/caja` | ❌ | ✅ | ❌ | ✅ |
| `/domicilios` | ❌ | ✅ | ❌ | ✅ |
| `/domicilios/nuevo` | ❌ | ✅ | ❌ | ✅ |
| `/mis-entregas` | ❌ | ❌ | ✅ | ❌ |
| `/mapa` | ❌ | ✅ | ✅ | ✅ |
| `/chat` | ✅ | ✅ | ✅ | ✅ |
| `/reportes` | ❌ | ❌ | ❌ | ✅ |
| `/admin` | ❌ | ❌ | ❌ | ✅ |
| `/admin/usuarios` | ❌ | ❌ | ❌ | ✅ |
| `/admin/productos` | ❌ | ❌ | ❌ | ✅ |
| `/admin/mesas` | ❌ | ❌ | ❌ | ✅ |

### 7.3 Navegación inferior por rol (BottomNav)

El BottomNav se construye dinámicamente según el rol del usuario autenticado.

**Mesero:**
```
Inicio (/) → Mesas (/mesas) → Chat (/chat)
```

**Cajero:**
```
Inicio → Mesas → Caja (/caja) → Domicilios (/domicilios) → Chat
```

**Domiciliario:**
```
Inicio → Mis Entregas (/mis-entregas) → Mapa (/mapa) → Chat
```

**Administrador:**
```
Inicio → Mesas → Caja → Reportes (/reportes) → Admin (/admin)
```

### 7.4 Permisos por acción de negocio

| Acción | Mesero | Cajero | Domiciliario | Admin |
|--------|--------|--------|--------------|-------|
| Ver mesas | ✅ | ✅ | ❌ | ✅ |
| Crear pedido de mesa | ✅ | ❌ | ❌ | ✅ |
| Ver pedidos activos | ✅ (propios) | ✅ (todos) | ❌ | ✅ |
| Avanzar estado pedido | ❌ | ✅ | ❌ | ✅ |
| Cancelar pedido | ❌ | ✅ | ❌ | ✅ |
| Cobrar pedido | ❌ | ✅ | ❌ | ✅ |
| Crear domicilio | ❌ | ✅ | ❌ | ✅ |
| Ver domicilios activos | ❌ | ✅ | ❌ | ✅ |
| Ver mis entregas | ❌ | ❌ | ✅ | ❌ |
| Actualizar estado entrega | ❌ | ✅ | ✅ | ✅ |
| Emitir ubicación GPS | ❌ | ❌ | ✅ | ❌ |
| Ver mapa tiempo real | ❌ | ✅ | ✅ | ✅ |
| Enviar mensajes chat | ✅ | ✅ | ✅ | ✅ |
| Ver reportes | ❌ | ❌ | ❌ | ✅ |
| CRUD usuarios | ❌ | ❌ | ❌ | ✅ |
| CRUD productos/menú | ❌ | ❌ | ❌ | ✅ |
| CRUD mesas (admin) | ❌ | ❌ | ❌ | ✅ |

---

## 8. MÓDULOS Y PANTALLAS DEL SISTEMA

### 8.1 Módulo AUTH — `/login`

**Acceso:** Todos los roles  
**Componentes:**
- `LoginPage.tsx` — Página contenedora con fondo blanco y logo
- `LoginForm.tsx` — Formulario login con documento y contraseña
- `RegisterForm.tsx` — Formulario de registro con selector de rol

**Características:**
- Campos: Documento (text), Contraseña (password)
- Registro: Nombre, Documento, Email (opc), Teléfono (opc), Contraseña, Rol
- Selector de rol en registro: chips táctiles visuales (no select)
- Validación en frontend con Zod + React Hook Form
- JWT almacenado en `localStorage` (`sazon-access`, `sazon-refresh`)
- Refresh automático de token al recibir 401
- Redirección automática a `/dashboard` tras login exitoso
- Tabs "Acceder" / "Registrarse" con pill switcher

**API:**
```
POST /api/auth/login    → { document, password }
POST /api/auth/register → { name, document, email?, phone?, password, role }
```

---

### 8.2 Módulo DASHBOARD — `/dashboard`

**Acceso:** Todos los roles  
**Componente:** `DashboardPage.tsx`

**Características:**
- Header con pretítulo, saludo personalizado con primer nombre + emoji
- Grid 2×2 de métricas en tiempo real:
  - Mesas activas (ámbar)
  - Pedidos pendientes (naranja)
  - Ingresos del día (verde)
  - Domicilios activos (azul)
- Divider decorativo en degradado ámbar
- Card "Información del sistema": rol con pill de color, ID usuario, estado operativo
- Datos reactivos al store de Zustand

---

### 8.3 Módulo MESAS — `/mesas` y `/mesas/:id`

**Acceso:** Mesero, Cajero, Administrador  
**Componentes:**
- `MesasPage.tsx` — Vista principal grid de mesas
- `MesaDetallePage.tsx` — Detalle de una mesa específica

#### MesasPage

**Características:**
- Resumen rápido: 3 contadores (Disponibles, Ocupadas, Por cobrar) en cards de color
- Filtros horizontales por estado: scroll horizontal sin barra
- Grid 3 columnas de MesaCard
- Cada MesaCard muestra: número, zona, estado con punto de color, capacidad
- Feedback táctil `active:scale-95`
- Estado vacío ilustrado si no hay mesas

#### MesaDetallePage

**Características:**
- Card header de mesa con estado y color correspondiente
- Muestra el pedido activo de esa mesa si existe:
  - Estado del pedido con badge
  - Lista de ítems con nombre, notas, cantidad, subtotal
  - Total del pedido
  - Botón "Ver pedido completo"
- Si no hay pedido: mensaje de estado vacío dashed
- Acciones contextuales por rol:
  - Mesero / Admin sin pedido: "Nuevo pedido"
  - Cajero / Admin con pedido entregado: "Procesar pago"
  - Cajero / Admin con pedido activo: "Gestionar estados"

---

### 8.4 Módulo PEDIDOS — `/pedidos/nuevo` y `/pedidos/:id`

**Acceso:** Mesero (crear), Cajero (ver/estados), Administrador (todo)  
**Componentes:**
- `PedidoNuevoPage.tsx` — Creación de pedido con catálogo
- `PedidoDetallePage.tsx` — Vista y gestión de un pedido existente

#### PedidoNuevoPage

**Características:**
- Recibe `?mesa=:id` como query param para asociar a mesa
- Buscador de productos en tiempo real
- Tabs de categorías horizontales con scroll: Todos, Entradas, Platos principales, Bebidas, Postres, Especiales
- Grid 2 columnas de ProductCard:
  - Imagen del producto o ícono por categoría
  - Nombre, precio en COP
  - Botón "+ Agregar" → controles +/− cuando qty > 0
- FAB sticky en la parte inferior: muestra total y cantidad de ítems
- Al tocar FAB: abre BottomSheet del carrito
- BottomSheet del carrito:
  - Lista de ítems con controles de cantidad
  - Notas opcionales por pedido (textarea)
  - Total general
  - Botón "Confirmar pedido"
- `POST /api/orders` al confirmar

#### PedidoDetallePage

**Características:**
- Badge del estado actual del pedido con color
- Stepper visual de progreso: Tomado → En preparación → Listo → Entregado → Pagado → Finalizado
- Lista completa de ítems con íconos de categoría, notas, cantidades, subtotales
- Total del pedido destacado
- Notas del pedido si existen
- Acciones según rol y estado:
  - Cajero/Admin: "Avanzar a [siguiente estado]"
  - Cajero/Admin con estado Entregado: "Procesar pago" → redirige a caja

---

### 8.5 Módulo CAJA — `/caja`

**Acceso:** Cajero, Administrador  
**Componente:** `CajaPage.tsx`

**Características:**
- Card de resumen: ingresos del día + botón "Cierre del día"
- Filtros por estado: Todos, Tomados, En preparación, Listos, Entregados
- Lista de pedidos activos:
  - Tipo (Mesa N° / Domicilio)
  - Badge de estado
  - Preview de ítems (máx 3 + "+N más")
  - Tiempo de creación
  - Total del pedido
  - Botones: "→ [Siguiente estado]" y "Cobrar" (si aplica)

**Modal de cobro:**
- Total destacado en ámbar
- Selector de método de pago (chips):
  - 💵 Efectivo
  - 💳 Tarjeta
  - 🏦 Transferencia
  - 📱 Nequi
  - 🔴 Daviplata
- Input de monto recibido (solo si efectivo)
- Cálculo automático de cambio con validación
- Botón "Confirmar pago"

**Modal cierre del día:**
- Resumen de ingresos totales del día
- Cantidad de pedidos completados
- Botón para generar reporte del día

**API:**
```
PATCH /api/orders/:id/status  → cambiar estado
POST  /api/payments           → procesar pago
GET   /api/payments/report/daily
```

---

### 8.6 Módulo DOMICILIOS — `/domicilios`, `/domicilios/nuevo`, `/mis-entregas`

**Acceso:** Cajero/Admin (gestión), Domiciliario (sus entregas)

#### DomiciliosPage (`/domicilios`)

**Características:**
- Stats: Pendientes y En camino en cards de 2 columnas
- Botón "Nuevo domicilio" prominente
- Acceso rápido al mapa en la TopBar
- Filtros: Todos, Pendientes, Asignados, En camino, Entregados
- Lista de domicilios:
  - Nombre del cliente, dirección, teléfono
  - Badge de estado con ícono
  - Total del pedido
  - Domiciliario asignado (si aplica)
  - Botón "Asignar domiciliario" si pendiente
  - Botón "Ver en mapa" si en camino

#### DomicilioNuevoPage (`/domicilios/nuevo`)

**Flujo en 3 pasos con stepper visual:**

1. **Datos del cliente:**
   - Nombre del cliente
   - Teléfono
   - Dirección (calle/carrera + número)
   - Barrio (opcional)
   - Referencia (opcional)

2. **Selección de productos:**
   - Grid 2 columnas del menú disponible
   - Controles de cantidad

3. **Resumen:**
   - Datos del cliente confirmados
   - Lista de productos con subtotales
   - Total del pedido
   - Botón "Crear domicilio"

**API:**
```
POST /api/deliveries  → crear domicilio con datos + items
```

#### MisEntregasPage (`/mis-entregas`)

**Acceso:** Solo Domiciliario

**Características:**
- Sección "Activas": entregas asignadas al domiciliario autenticado
- Card de entrega activa con borde ámbar:
  - Nombre y datos del cliente
  - Dirección con referencia
  - Badge de estado
  - Botón "Llamar" (tel: link)
  - Botón "Navegar" (hacia MapaPage)
  - Botón "Salir a entregar" si estado = asignado
  - Botón "Marcar como entregado" si estado = en_camino
- Sección "Historial reciente": últimas 10 entregas finalizadas

---

### 8.7 Módulo MAPA — `/mapa`

**Acceso:** Cajero, Domiciliario, Administrador  
**Componente:** `MapaPage.tsx`

**Características:**
- Mapa Leaflet con tiles de OpenStreetMap
- Ocupa toda la pantalla disponible (altura dinámica)
- Marcadores 🛵 por cada domiciliario activo (GPS en tiempo real)
- Popup al tocar marcador: nombre del domiciliario + hora de última actualización
- Cards horizontales en la parte superior: domiciliario activo, cliente destino, timestamp
- Indicador de señal GPS activa (punto verde pulsante) para domiciliarios
- Domiciliarios: ven su propia ubicación marcada
- Cajero/Admin: ven todos los domiciliarios en ruta

**GPS técnico:**
```typescript
navigator.geolocation.watchPosition(
  (position) => {
    emitLocation(position.coords.latitude, position.coords.longitude)
  },
  (error) => console.error(error),
  { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
)
```

---

### 8.8 Módulo CHAT — `/chat`

**Acceso:** Todos los roles  
**Componente:** `ChatPage.tsx`

**Características:**
- Chat en tiempo real vía Socket.IO
- Agrupación de mensajes por fecha
- Burbuja propia: derecha, fondo ámbar oscuro, texto blanco
- Burbuja ajena: izquierda, fondo blanco, borde piedra
- Header de mensaje ajeno: nombre + rol con pill de color
- Timestamp por mensaje (hora en formato 12h)
- Input con textarea multilinea (máx 4 filas)
- Enter para enviar, Shift+Enter para nueva línea
- Botón enviar con ícono de avión
- Auto-scroll al último mensaje al abrir y al recibir nuevo
- Badge de mensajes no leídos en el BottomNav
- Al abrir chat: `markAllRead()` en el store

**API Socket:**
```
Emite:   chat:send         { content: string }
Escucha: chat:message      { message: ChatMessage }
```

---

### 8.9 Módulo REPORTES — `/reportes`

**Acceso:** Solo Administrador  
**Componente:** `ReportesPage.tsx`

**Características:**
- Selector de fecha (día actual por defecto) y rango
- Métricas del día:
  - Total de ingresos (COP)
  - Número de pedidos
  - Número de domicilios
  - Ticket promedio
- Desglose por método de pago (barras visuales o gráfica)
- Top 5 productos más vendidos (ranking con cantidades)
- Resumen de pedidos por estado (tabla)
- Botón para exportar reporte

**API:**
```
GET /api/reports/daily?date=YYYY-MM-DD
GET /api/reports/range?from=YYYY-MM-DD&to=YYYY-MM-DD
```

---

### 8.10 Módulo ADMIN — `/admin`, `/admin/usuarios`, `/admin/productos`, `/admin/mesas`

**Acceso:** Solo Administrador

#### AdminPage (`/admin`)

**Panel central con tarjetas de acceso rápido:**
- Gestionar usuarios
- Gestionar menú / productos
- Configurar mesas
- Ver reportes
- Estadísticas globales del sistema

#### UsuariosPage (`/admin/usuarios`)

**Características:**
- Lista paginada de todos los usuarios del sistema
- Filtros por rol
- Buscador por nombre o documento
- Cada fila: avatar inicial, nombre, documento, rol (pill), estado (activo/inactivo), acciones
- Acciones: Editar, Activar/Desactivar, Resetear contraseña
- Botón "Nuevo usuario"
- Modal de creación/edición:
  - Nombre completo
  - Documento
  - Email (opcional)
  - Teléfono (opcional)
  - Contraseña (solo en creación)
  - Rol (chips visuales)
  - Toggle activo/inactivo

**API:**
```
GET   /api/users
POST  /api/users
PATCH /api/users/:id
PATCH /api/users/:id/toggle-active
PATCH /api/users/:id/reset-password
```

#### ProductosPage (`/admin/productos`)

**Características:**
- Lista de productos por categorías (tabs)
- Toggle de disponibilidad en tiempo real (sin recargar)
- Cada card: imagen/ícono, nombre, categoría, precio, disponibilidad, acciones
- Botón "Nuevo producto"
- Modal de creación/edición:
  - Nombre
  - Descripción
  - Precio (COP)
  - Categoría (select)
  - URL de imagen (opcional)
  - Toggle disponible / no disponible
  - Toggle activo / inactivo

**Categorías disponibles:**
- 🥗 Entradas
- 🍲 Platos principales
- 🥤 Bebidas
- 🍮 Postres
- ⭐ Especiales
- 🛵 Solo domicilio

**API:**
```
GET    /api/products
POST   /api/products
PATCH  /api/products/:id
PATCH  /api/products/:id/toggle-availability
DELETE /api/products/:id
```

#### MesasAdminPage (`/admin/mesas`)

**Características:**
- Vista de todas las mesas configuradas
- Botón "Nueva mesa"
- Modal de creación/edición:
  - Número de mesa
  - Capacidad (personas)
  - Zona (ej: Terraza, Salón principal, Privado)
- Eliminar mesa (solo si no tiene pedido activo)

**API:**
```
GET    /api/tables
POST   /api/tables
PATCH  /api/tables/:id
DELETE /api/tables/:id
```

---

## 9. FLUJOS OPERATIVOS COMPLETOS

### 9.1 Flujo principal: Mesa → Pedido → Pago

```
1. [Mesero] entra a /mesas
2. [Mesero] toca mesa verde (disponible)
3. [Mesero] en /mesas/:id toca "Nuevo pedido"
4. [Mesero] en /pedidos/nuevo selecciona productos por categoría
5. [Mesero] agrega productos al carrito (controles +/−)
6. [Mesero] abre carrito (FAB) → agrega notas opcionales
7. [Mesero] confirma pedido → POST /api/orders
8. [Sistema] mesa pasa a "ocupada"
9. [Sistema] Socket emite order:created a todos
10. [Cajero] recibe notificación push "Nuevo pedido"
11. [Cajero] ve pedido en /caja con estado "Tomado"
12. [Cajero] avanza estado → "En preparación"
13. [Sistema] Socket emite order:updated → [Mesero] ve actualización
14. [Cajero] avanza estado → "Listo"
15. [Mesero] recibe notificación "Pedido listo"
16. [Mesero] entrega en mesa → marca "Entregado" desde /pedidos/:id
17. [Cajero] ve pedido en estado Entregado → toca "Cobrar"
18. [Cajero] abre modal de cobro:
    → selecciona método de pago
    → ingresa monto recibido (si efectivo)
    → sistema calcula cambio automático
    → confirma pago → POST /api/payments
19. [Sistema] mesa vuelve a "disponible"
20. [Sistema] Socket emite table:updated + payment:completed
21. [Admin] ve ingreso reflejado en dashboard y reportes
```

### 9.2 Flujo domicilio completo

```
1. [Cajero] entra a /domicilios → toca "Nuevo domicilio"
2. [Cajero] paso 1: ingresa datos del cliente (nombre, teléfono, dirección)
3. [Cajero] paso 2: selecciona productos del menú
4. [Cajero] paso 3: revisa resumen → confirma → POST /api/deliveries
5. [Sistema] domicilio aparece con estado "Pendiente"
6. [Cajero] asigna domiciliario disponible → PATCH /api/deliveries/:id/assign
7. [Sistema] estado cambia a "Asignado"
8. [Domiciliario] recibe notificación push "Nueva entrega asignada"
9. [Domiciliario] en /mis-entregas ve la entrega activa
10. [Domiciliario] toca "Salir a entregar" → PATCH status → "En camino"
11. [Domiciliario] GPS se activa: watchPosition → Socket driver:location
12. [Cajero/Admin] en /mapa ve marcador 🛵 moviéndose en tiempo real
13. [Domiciliario] llega → toca "Marcar como entregado" → PATCH status → "Entregado"
14. [Cajero] cobra el pedido (si pago al domiciliario → registrado en caja)
15. [Admin] ve el domicilio en reportes del día
```

### 9.3 Flujo administración

```
1. [Admin] accede a /admin → panel central con accesos rápidos
2. [Admin] /admin/usuarios:
   → ve lista de todos los usuarios
   → crea nuevo usuario (rol, datos, contraseña)
   → edita usuario existente
   → desactiva usuario (no puede iniciar sesión)
   → resetea contraseña de usuario
3. [Admin] /admin/productos:
   → ve catálogo completo organizado por categorías
   → crea nuevo producto con precio, categoría e imagen
   → edita precio o descripción de producto existente
   → toggle disponibilidad (ocultar del menú sin eliminar)
   → elimina producto inactivo
4. [Admin] /admin/mesas:
   → ve todas las mesas configuradas
   → agrega nueva mesa con número, capacidad y zona
   → edita datos de una mesa
   → elimina mesa si no tiene pedido activo
5. [Admin] /reportes:
   → selecciona fecha o rango
   → ve ingresos totales, pedidos, domicilios, ticket promedio
   → analiza desglose por método de pago
   → ve ranking de productos más vendidos
```

### 9.4 Flujo offline

```
1. [Usuario] pierde conexión a internet
2. [Sistema] Service Worker detecta falla de red
3. [Layout] muestra banner amarillo "Sin conexión — Modo offline activo"
4. [TopBar] muestra badge "Offline" en rojo
5. [Mesero] puede ver menú en caché (IndexedDB)
6. [Mesero] puede crear pedido → se guarda en cola offline (IndexedDB)
7. [Sistema] Background Sync espera reconexión
8. [Usuario] recupera conexión a internet
9. [Sistema] Service Worker detecta reconexión
10. [Sistema] procesa cola offline → sincroniza pedidos pendientes
11. [Layout] oculta banner de offline
12. [Store] actualiza datos con los del servidor
```

---

## 10. ESTRUCTURA DE CARPETAS FRONTEND

```
frontend/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service Worker compilado
│   └── icons/                 # Íconos PWA (192px, 512px, maskable)
│
├── src/
│   │
│   ├── assets/
│   │   └── logo.jpeg          # Logo oficial del restaurante
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx           # Botón base: variantes primary/secondary/ghost
│   │   │   ├── Input.tsx            # Input con label, error y estado disabled
│   │   │   ├── Select.tsx           # Select accesible con opciones tipadas
│   │   │   ├── Modal.tsx            # Modal centrado con overlay
│   │   │   ├── BottomSheet.tsx      # Sheet slide-up desde abajo (PWA)
│   │   │   ├── Badge.tsx            # Badge de estado con variantes de color
│   │   │   ├── Spinner.tsx          # Spinner de carga animado
│   │   │   ├── PageLoader.tsx       # Pantalla de carga completa (Suspense)
│   │   │   ├── EmptyState.tsx       # Estado vacío con ilustración y CTA
│   │   │   ├── ErrorState.tsx       # Estado de error con botón retry
│   │   │   ├── OfflineBanner.tsx    # Banner "Sin conexión"
│   │   │   ├── NotificationBell.tsx # Campana con badge contador
│   │   │   ├── Avatar.tsx           # Avatar circular con inicial del nombre
│   │   │   └── Toast.tsx            # Notificación toast temporal
│   │   │
│   │   ├── layout/
│   │   │   ├── Layout.tsx           # Contenedor principal: TopBar + main + BottomNav
│   │   │   ├── TopBar.tsx           # Barra superior sticky con logo y acciones
│   │   │   ├── BottomNav.tsx        # Navegación inferior dinámica por rol
│   │   │   └── PageHeader.tsx       # Cabecera de sección interna
│   │   │
│   │   ├── forms/
│   │   │   ├── FormField.tsx        # Campo de formulario con label, error, hint
│   │   │   ├── PhoneInput.tsx       # Input teléfono con prefijo +57
│   │   │   └── CurrencyInput.tsx    # Input moneda formateado en COP
│   │   │
│   │   └── maps/
│   │       ├── DeliveryMap.tsx      # Mapa Leaflet de seguimiento de domicilio
│   │       └── DriverMarker.tsx     # Marcador 🛵 personalizado para domiciliario
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx        # Página de login/registro
│   │   │   ├── LoginForm.tsx        # Form de login con validación Zod
│   │   │   └── RegisterForm.tsx     # Form de registro con selector de rol
│   │   │
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx    # Panel principal con métricas por rol
│   │   │
│   │   ├── mesas/
│   │   │   ├── MesasPage.tsx        # Grid de mesas con filtros y estados
│   │   │   ├── MesaDetallePage.tsx  # Detalle: pedido activo + acciones
│   │   │   └── components/
│   │   │       ├── MesaCard.tsx         # Card de mesa con color por estado
│   │   │       └── MesaStatusBadge.tsx  # Badge de estado de mesa
│   │   │
│   │   ├── pedidos/
│   │   │   ├── PedidoNuevoPage.tsx  # Catálogo + carrito para crear pedido
│   │   │   ├── PedidoDetallePage.tsx# Detalle con stepper de estados
│   │   │   └── components/
│   │   │       ├── MenuCatalog.tsx        # Catálogo por categorías
│   │   │       ├── OrderCart.tsx          # BottomSheet del carrito
│   │   │       ├── OrderItemRow.tsx       # Fila de ítem en el carrito
│   │   │       ├── ProductCard.tsx        # Card de producto del menú
│   │   │       └── OrderStatusStepper.tsx # Stepper visual de estados
│   │   │
│   │   ├── caja/
│   │   │   ├── CajaPage.tsx         # Lista pedidos activos para gestión y cobro
│   │   │   └── components/
│   │   │       ├── CobroModal.tsx        # Modal cobro: método + monto + cambio
│   │   │       ├── PedidoCobroCard.tsx   # Card de pedido en caja
│   │   │       └── CierreCajaModal.tsx   # Modal cierre diario con resumen
│   │   │
│   │   ├── domicilios/
│   │   │   ├── DomiciliosPage.tsx    # Lista domicilios activos (cajero/admin)
│   │   │   ├── DomicilioNuevoPage.tsx# Wizard 3 pasos: cliente → productos → resumen
│   │   │   ├── MisEntregasPage.tsx   # Entregas asignadas al domiciliario
│   │   │   └── components/
│   │   │       ├── DomicilioCard.tsx            # Card con estado y acciones
│   │   │       ├── AsignarDomiciliarioModal.tsx # Modal para asignar repartidor
│   │   │       └── DomicilioStatusBadge.tsx     # Badge de estado con ícono
│   │   │
│   │   ├── mapa/
│   │   │   └── MapaPage.tsx          # Mapa Leaflet + marcadores GPS tiempo real
│   │   │
│   │   ├── chat/
│   │   │   ├── ChatPage.tsx          # Chat en tiempo real Socket.IO
│   │   │   └── components/
│   │   │       ├── MessageBubble.tsx # Burbuja de mensaje propio/ajeno
│   │   │       └── ChatInput.tsx     # Input con textarea + botón enviar
│   │   │
│   │   ├── reportes/
│   │   │   ├── ReportesPage.tsx      # Reportes diarios y por rango
│   │   │   └── components/
│   │   │       ├── ResumenDiario.tsx       # Cards de métricas del día
│   │   │       ├── MetodoPagoChart.tsx     # Gráfica de métodos de pago
│   │   │       └── TopProductosTable.tsx   # Ranking de productos
│   │   │
│   │   └── admin/
│   │       ├── AdminPage.tsx          # Dashboard admin con accesos rápidos
│   │       ├── usuarios/
│   │       │   ├── UsuariosPage.tsx        # Lista paginada de usuarios
│   │       │   ├── UsuarioFormModal.tsx    # Modal crear/editar usuario
│   │       │   └── UsuarioRow.tsx          # Fila de usuario con acciones
│   │       ├── productos/
│   │       │   ├── ProductosPage.tsx       # Catálogo admin con CRUD
│   │       │   ├── ProductoFormModal.tsx   # Modal crear/editar producto
│   │       │   └── ProductoCard.tsx        # Card con toggle disponibilidad
│   │       └── mesas/
│   │           ├── MesasAdminPage.tsx      # Configuración de mesas
│   │           └── MesaFormModal.tsx       # Modal crear/editar mesa
│   │
│   ├── hooks/
│   │   ├── useAuth.ts           # Login, logout, refresh automático
│   │   ├── useTables.ts         # TanStack Query: GET /api/tables
│   │   ├── useOrders.ts         # TanStack Query: GET /api/orders
│   │   ├── useDeliveries.ts     # TanStack Query: GET /api/deliveries
│   │   ├── useProducts.ts       # TanStack Query: GET /api/products
│   │   ├── useUsers.ts          # TanStack Query: GET /api/users (admin)
│   │   ├── useSocket.ts         # Inicializa socket y suscripciones
│   │   ├── useGPS.ts            # watchPosition + emitLocation
│   │   ├── useOnlineStatus.ts   # Navigator.onLine listener
│   │   └── useNotifications.ts  # FCM push notifications setup
│   │
│   ├── services/
│   │   ├── api.ts               # Cliente HTTP base + todos los servicios
│   │   └── indexeddb.ts         # Dexie.js: tablas offline
│   │
│   ├── sockets/
│   │   └── socketService.ts     # Socket.IO client + handlers de eventos
│   │
│   ├── store/
│   │   └── index.ts             # Zustand store (7 slices)
│   │
│   ├── types/
│   │   └── index.ts             # Todos los tipos e interfaces TypeScript
│   │
│   ├── routes/
│   │   └── index.tsx            # BrowserRouter + rutas + guards RequireAuth/RequireRole
│   │
│   ├── constants/
│   │   ├── orderStatus.ts       # Config colores/labels estados de pedido
│   │   ├── tableStatus.ts       # Config colores/labels estados de mesa
│   │   ├── deliveryStatus.ts    # Config colores/labels estados domicilio
│   │   ├── roles.ts             # Config colores/labels/íconos por rol
│   │   ├── paymentMethods.ts    # Config métodos de pago
│   │   └── categories.ts        # Config categorías de productos
│   │
│   ├── utils/
│   │   ├── formatCurrency.ts    # Formatear moneda en COP (es-CO locale)
│   │   ├── formatDate.ts        # Fechas en español colombiano
│   │   └── classNames.ts        # Utilitario cn() para clases condicionales
│   │
│   ├── validations/
│   │   ├── authSchemas.ts       # Zod: login, registro
│   │   ├── orderSchemas.ts      # Zod: crear pedido, items
│   │   ├── deliverySchemas.ts   # Zod: crear domicilio
│   │   ├── productSchemas.ts    # Zod: crear/editar producto
│   │   └── userSchemas.ts       # Zod: crear/editar usuario
│   │
│   ├── workers/
│   │   └── sw.ts                # Service Worker con Workbox (generado por Vite PWA)
│   │
│   ├── indexeddb/
│   │   └── db.ts                # Dexie.js: definición de tablas y modelos offline
│   │
│   ├── pages/
│   │   └── NotFoundPage.tsx     # Página 404
│   │
│   ├── styles/
│   │   └── globals.css          # Variables CSS + directivas Tailwind + fuentes
│   │
│   ├── App.tsx                  # QueryClientProvider + SocketProvider + Router
│   └── main.tsx                 # Entry point: ReactDOM + PWA register
│
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── .env.example
├── .eslintrc.js
├── .prettierrc
├── Dockerfile
└── package.json
```

---

## 11. TIPOS TYPESCRIPT DEL SISTEMA

```typescript
// src/types/index.ts

// ─── ROLES ──────────────────────────────────────────────────
export type Role = 'administrador' | 'cajero' | 'mesero' | 'domiciliario'

// ─── USUARIO ────────────────────────────────────────────────
export interface User {
  id: string
  name: string
  document: string
  email?: string
  phone?: string
  role: Role
  isActive: boolean
  createdAt: string
}

// ─── AUTH ────────────────────────────────────────────────────
export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

// ─── MESA ────────────────────────────────────────────────────
export type TableStatus = 'disponible' | 'ocupada' | 'pendiente_pago'

export interface Table {
  id: string
  number: number
  status: TableStatus
  capacity?: number
  currentOrderId?: string
  zone?: string
}

// ─── PRODUCTO ────────────────────────────────────────────────
export type ProductCategory =
  | 'entrada' | 'plato_principal' | 'bebida'
  | 'postre'  | 'especial'        | 'domicilio'

export interface Product {
  id: string
  name: string
  description?: string
  price: number
  category: ProductCategory
  imageUrl?: string
  isAvailable: boolean
  isActive: boolean
}

// ─── PEDIDO ──────────────────────────────────────────────────
export type OrderStatus =
  | 'tomado' | 'en_preparacion' | 'listo'
  | 'entregado' | 'pagado' | 'finalizado' | 'cancelado'

export type OrderType = 'mesa' | 'domicilio'

export interface OrderItem {
  id: string
  productId: string
  product: Product
  quantity: number
  unitPrice: number
  subtotal: number
  notes?: string
}

export interface Order {
  id: string
  type: OrderType
  tableId?: string
  table?: Table
  items: OrderItem[]
  status: OrderStatus
  total: number
  notes?: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

// ─── PAGO ────────────────────────────────────────────────────
export type PaymentMethod =
  | 'efectivo' | 'tarjeta' | 'transferencia' | 'nequi' | 'daviplata'

export interface Payment {
  id: string
  orderId: string
  amount: number
  method: PaymentMethod
  receivedAmount?: number
  change?: number
  paidAt: string
  cashierId: string
}

// ─── DOMICILIO ───────────────────────────────────────────────
export type DeliveryStatus =
  | 'pendiente' | 'asignado' | 'en_camino' | 'entregado' | 'cancelado'

export interface DeliveryAddress {
  street: string
  neighborhood?: string
  reference?: string
  lat?: number
  lng?: number
}

export interface Delivery {
  id: string
  orderId: string
  order: Order
  driverId?: string
  driver?: User
  status: DeliveryStatus
  address: DeliveryAddress
  currentLat?: number
  currentLng?: number
  estimatedTime?: number
  customerName: string
  customerPhone: string
  createdAt: string
  updatedAt: string
}

// ─── GPS ─────────────────────────────────────────────────────
export interface LocationUpdate {
  driverId: string
  lat: number
  lng: number
  timestamp: number
}

// ─── CHAT ────────────────────────────────────────────────────
export interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  senderRole: Role
  content: string
  timestamp: string
  read: boolean
}

// ─── REPORTES ────────────────────────────────────────────────
export interface DailySummary {
  date: string
  totalOrders: number
  totalRevenue: number
  totalDeliveries: number
  paymentBreakdown: Record<PaymentMethod, number>
  topProducts: { product: Product; quantity: number }[]
  ordersByStatus: Record<OrderStatus, number>
  averageTicket: number
}

// ─── NOTIFICACIONES ──────────────────────────────────────────
export type NotificationType =
  | 'nuevo_pedido' | 'pedido_listo' | 'nuevo_domicilio'
  | 'mensaje' | 'alerta' | 'pago'

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  body: string
  read: boolean
  createdAt: string
  payload?: Record<string, unknown>
}

// ─── API GENÉRICO ────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiError {
  message: string
  code?: string
  field?: string
}
```

---

## 12. ESTADO GLOBAL — ZUSTAND STORE

El store se divide en 7 slices independientes:

| Slice | Responsabilidad |
|-------|----------------|
| `AuthSlice` | Usuario autenticado, access token |
| `TablesSlice` | Lista de mesas y actualizaciones |
| `OrdersSlice` | Pedidos activos y pedido seleccionado |
| `DeliveriesSlice` | Domicilios y ubicaciones GPS |
| `ChatSlice` | Mensajes y contador no leídos |
| `NotificationsSlice` | Notificaciones push del sistema |
| `UISlice` | Estado online/offline, cola pendiente |

**Persistencia:** Solo `user` y `accessToken` se persisten en `localStorage` mediante `zustand/middleware/persist`. Ningún dato sensible de pedidos, pagos o tokens de terceros se almacena localmente.

```typescript
// Configuración persist
persist(
  (set) => ({ ... }),
  {
    name: 'sazon-store',
    partialize: (s) => ({
      user: s.user,
      accessToken: s.accessToken,
    }),
  }
)
```

---

## 13. RUTAS Y GUARDS DE AUTENTICACIÓN

### Guards implementados

**`RequireAuth`:** Verifica que existan `user` y `accessToken` en el store. Si no → redirige a `/login`.

**`RequireRole`:** Recibe un array de roles permitidos. Si el rol del usuario no está incluido → redirige a `/dashboard`.

### Lazy loading

Todas las páginas se cargan con `React.lazy()` + `<Suspense fallback={<PageLoader />}>` para code splitting automático por ruta.

### Configuración de rutas

```typescript
export const ROLE_ROUTES: Record<Role, string[]> = {
  mesero:        ['/dashboard', '/mesas', '/mesas/:id', '/pedidos/nuevo', '/pedidos/:id', '/chat'],
  cajero:        ['/dashboard', '/mesas', '/mesas/:id', '/caja', '/domicilios', '/domicilios/nuevo', '/mapa', '/chat'],
  domiciliario:  ['/dashboard', '/mis-entregas', '/mapa', '/chat'],
  administrador: ['/dashboard', '/mesas', '/mesas/:id', '/pedidos/nuevo', '/pedidos/:id',
                  '/caja', '/domicilios', '/domicilios/nuevo', '/mapa', '/chat',
                  '/reportes', '/admin', '/admin/usuarios', '/admin/productos', '/admin/mesas'],
}
```

---

## 14. SERVICIOS API — CONTRATO FRONTEND

### Cliente HTTP base

- Base URL: `import.meta.env.VITE_API_URL`
- Inyecta `Authorization: Bearer <token>` en cada request
- Al recibir 401: intenta refresh automático → si falla, redirige a `/login`
- Lanza errores tipados con mensaje del servidor

### Servicios disponibles

| Servicio | Métodos principales |
|----------|-------------------|
| `authService` | `login`, `register`, `logout`, `me` |
| `usersService` | `getAll`, `getById`, `create`, `update`, `toggleActive`, `resetPassword` |
| `tablesService` | `getAll`, `getById`, `create`, `update`, `updateStatus`, `delete` |
| `productsService` | `getAll`, `getById`, `create`, `update`, `toggleAvailability`, `delete` |
| `ordersService` | `getAll`, `getById`, `create`, `updateStatus`, `addItem`, `removeItem`, `cancel` |
| `paymentsService` | `processPayment`, `getDailyReport`, `getHistory` |
| `deliveriesService` | `getAll`, `getById`, `getMyDeliveries`, `create`, `assign`, `updateStatus`, `updateLocation` |
| `reportsService` | `getDaily`, `getRange` |

---

## 15. CONTRATO BACKEND COMPLETO

### Base URL

```
Producción:  https://api.sazonuvitano.com
Desarrollo:  http://localhost:3000
```

### Autenticación

Todos los endpoints protegidos requieren:
```
Authorization: Bearer <accessToken>
```

- Access token: expira en **15 minutos**
- Refresh token: expira en **7 días**

### Endpoints AUTH

| Método | Ruta | Body | Respuesta | Roles |
|--------|------|------|-----------|-------|
| POST | `/api/auth/login` | `{ document, password }` | `AuthResponse` | Público |
| POST | `/api/auth/register` | `{ name, document, email?, phone?, password, role }` | `AuthResponse` | Admin |
| POST | `/api/auth/refresh` | `{ refreshToken }` | `{ accessToken, refreshToken }` | — |
| POST | `/api/auth/logout` | — | `200 OK` | Auth |
| GET | `/api/auth/me` | — | `User` | Auth |

### Endpoints USUARIOS

| Método | Ruta | Descripción | Roles |
|--------|------|-------------|-------|
| GET | `/api/users` | Lista paginada. Query: `role`, `page`, `limit`, `search` | Admin |
| GET | `/api/users/:id` | Usuario por ID | Admin |
| POST | `/api/users` | Crear usuario | Admin |
| PATCH | `/api/users/:id` | Editar usuario | Admin |
| PATCH | `/api/users/:id/toggle-active` | Activar/desactivar | Admin |
| PATCH | `/api/users/:id/reset-password` | `{ newPassword }` | Admin |

### Endpoints MESAS

| Método | Ruta | Descripción | Roles |
|--------|------|-------------|-------|
| GET | `/api/tables` | Todas las mesas | Mesero / Cajero / Admin |
| GET | `/api/tables/:id` | Mesa por ID | Mesero / Cajero / Admin |
| POST | `/api/tables` | `{ number, capacity?, zone? }` | Admin |
| PATCH | `/api/tables/:id` | Editar mesa | Admin |
| PATCH | `/api/tables/:id/status` | `{ status }` | Mesero / Cajero / Admin |
| DELETE | `/api/tables/:id` | Solo si sin pedido activo | Admin |

### Endpoints PRODUCTOS

| Método | Ruta | Descripción | Roles |
|--------|------|-------------|-------|
| GET | `/api/products` | Todos. Query: `category`, `isAvailable` | Auth |
| GET | `/api/products/:id` | Producto por ID | Auth |
| POST | `/api/products` | Crear producto | Admin |
| PATCH | `/api/products/:id` | Editar producto | Admin |
| PATCH | `/api/products/:id/toggle-availability` | Toggle disponible | Admin |
| DELETE | `/api/products/:id` | Eliminar | Admin |

### Endpoints PEDIDOS

| Método | Ruta | Descripción | Roles |
|--------|------|-------------|-------|
| GET | `/api/orders` | Lista. Query: `status`, `tableId`, `type` | Cajero / Admin |
| GET | `/api/orders/:id` | Pedido completo con ítems | Mesero / Cajero / Admin |
| POST | `/api/orders` | `{ type, tableId?, items[], notes? }` | Mesero / Admin |
| PATCH | `/api/orders/:id/status` | `{ status }` | Cajero / Admin |
| POST | `/api/orders/:id/items` | `{ productId, quantity, notes? }` | Mesero / Admin |
| DELETE | `/api/orders/:id/items/:itemId` | Quitar ítem | Mesero / Admin |
| PATCH | `/api/orders/:id/cancel` | Cancelar pedido | Cajero / Admin |

### Endpoints PAGOS

| Método | Ruta | Descripción | Roles |
|--------|------|-------------|-------|
| POST | `/api/payments` | `{ orderId, method, receivedAmount? }` | Cajero / Admin |
| GET | `/api/payments` | Historial paginado. Query: `from`, `to`, `page` | Admin |
| GET | `/api/payments/report/daily` | Query: `date` (YYYY-MM-DD) | Cajero / Admin |

### Endpoints DOMICILIOS

| Método | Ruta | Descripción | Roles |
|--------|------|-------------|-------|
| GET | `/api/deliveries` | Todos. Query: `status` | Cajero / Admin |
| GET | `/api/deliveries/:id` | Domicilio por ID | Cajero / Domiciliario / Admin |
| GET | `/api/deliveries/my` | Entregas del domiciliario autenticado | Domiciliario |
| POST | `/api/deliveries` | `{ customerName, customerPhone, address, orderId?, items? }` | Cajero / Admin |
| PATCH | `/api/deliveries/:id/assign` | `{ driverId }` | Cajero / Admin |
| PATCH | `/api/deliveries/:id/status` | `{ status }` | Domiciliario / Cajero / Admin |
| PATCH | `/api/deliveries/location` | `{ lat, lng }` | Domiciliario |

### Endpoints REPORTES

| Método | Ruta | Descripción | Roles |
|--------|------|-------------|-------|
| GET | `/api/reports/daily` | Query: `date` | Admin |
| GET | `/api/reports/range` | Query: `from`, `to` | Admin |

### Formato de respuestas

**Éxito — objeto:**
```json
{ "data": { ... }, "success": true, "message": "Descripción opcional" }
```

**Éxito — lista paginada:**
```json
{ "data": [...], "total": 100, "page": 1, "limit": 20, "totalPages": 5 }
```

**Error:**
```json
{ "success": false, "message": "Descripción del error", "code": "UNAUTHORIZED", "field": "password" }
```

### HTTP Status Codes

| Código | Significado |
|--------|-------------|
| 200 | OK — Operación exitosa |
| 201 | Created — Recurso creado |
| 400 | Bad Request — Error de validación |
| 401 | Unauthorized — No autenticado o token inválido |
| 403 | Forbidden — Rol insuficiente para la acción |
| 404 | Not Found — Recurso no encontrado |
| 409 | Conflict — Conflicto de estado (ej: mesa ocupada) |
| 422 | Unprocessable — Error de lógica de negocio |
| 429 | Too Many Requests — Rate limit superado |
| 500 | Internal Server Error |

---

## 16. BASE DE DATOS — ESQUEMA PRISMA

```prisma
// server/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── ENUMS ───────────────────────────────────────────────────

enum Role {
  mesero
  cajero
  domiciliario
  administrador
}

enum TableStatus {
  disponible
  ocupada
  pendiente_pago
}

enum ProductCategory {
  entrada
  plato_principal
  bebida
  postre
  especial
  domicilio
}

enum OrderType {
  mesa
  domicilio
}

enum OrderStatus {
  tomado
  en_preparacion
  listo
  entregado
  pagado
  finalizado
  cancelado
}

enum PaymentMethod {
  efectivo
  tarjeta
  transferencia
  nequi
  daviplata
}

enum DeliveryStatus {
  pendiente
  asignado
  en_camino
  entregado
  cancelado
}

// ─── MODELOS ─────────────────────────────────────────────────

model User {
  id         String     @id @default(uuid())
  name       String
  document   String     @unique
  email      String?    @unique
  phone      String?
  password   String
  role       Role
  isActive   Boolean    @default(true)
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt

  orders     Order[]    @relation("creator")
  deliveries Delivery[] @relation("driver")
  payments   Payment[]  @relation("cashier")

  @@index([role])
  @@index([document])
}

model Table {
  id       String      @id @default(uuid())
  number   Int         @unique
  status   TableStatus @default(disponible)
  capacity Int?
  zone     String?
  orders   Order[]

  @@index([status])
}

model Product {
  id          String          @id @default(uuid())
  name        String
  description String?
  price       Float
  category    ProductCategory
  imageUrl    String?
  isAvailable Boolean         @default(true)
  isActive    Boolean         @default(true)
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt

  orderItems  OrderItem[]

  @@index([category])
  @@index([isAvailable])
}

model Order {
  id        String      @id @default(uuid())
  type      OrderType   @default(mesa)
  tableId   String?
  table     Table?      @relation(fields: [tableId], references: [id])
  items     OrderItem[]
  status    OrderStatus @default(tomado)
  total     Float
  notes     String?
  createdBy String
  creator   User        @relation("creator", fields: [createdBy], references: [id])
  payment   Payment?
  delivery  Delivery?
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt

  @@index([status])
  @@index([tableId])
  @@index([type])
  @@index([createdAt])
}

model OrderItem {
  id        String  @id @default(uuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId String
  product   Product @relation(fields: [productId], references: [id])
  quantity  Int
  unitPrice Float
  subtotal  Float
  notes     String?

  @@index([orderId])
}

model Payment {
  id             String        @id @default(uuid())
  orderId        String        @unique
  order          Order         @relation(fields: [orderId], references: [id])
  amount         Float
  method         PaymentMethod
  receivedAmount Float?
  change         Float?
  paidAt         DateTime      @default(now())
  cashierId      String
  cashier        User          @relation("cashier", fields: [cashierId], references: [id])

  @@index([paidAt])
  @@index([method])
}

model Delivery {
  id            String         @id @default(uuid())
  orderId       String         @unique
  order         Order          @relation(fields: [orderId], references: [id])
  driverId      String?
  driver        User?          @relation("driver", fields: [driverId], references: [id])
  status        DeliveryStatus @default(pendiente)
  street        String
  neighborhood  String?
  reference     String?
  addressLat    Float?
  addressLng    Float?
  currentLat    Float?
  currentLng    Float?
  estimatedTime Int?           // minutos estimados
  customerName  String
  customerPhone String
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  @@index([status])
  @@index([driverId])
}
```

---

## 17. WEBSOCKETS — EVENTOS EN TIEMPO REAL

### Conexión

```typescript
// Cliente
const socket = io(SOCKET_URL, {
  auth: { token: accessToken },
  transports: ['websocket'],
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
})

// Servidor (middleware de autenticación)
io.use((socket, next) => {
  const token = socket.handshake.auth.token
  const payload = jwt.verify(token, process.env.JWT_SECRET)
  socket.data.user = payload
  next()
})
```

### Eventos Servidor → Cliente

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `order:created` | `{ order: Order }` | Nuevo pedido creado |
| `order:updated` | `{ order: Order }` | Pedido actualizado |
| `order:status` | `{ orderId, status }` | Cambio de estado de pedido |
| `table:updated` | `{ table: Table }` | Mesa actualizada |
| `delivery:created` | `{ delivery: Delivery }` | Nuevo domicilio |
| `delivery:updated` | `{ delivery: Delivery }` | Domicilio actualizado |
| `delivery:location` | `{ driverId, lat, lng, timestamp }` | GPS tiempo real |
| `chat:message` | `{ message: ChatMessage }` | Nuevo mensaje de chat |
| `payment:completed` | `{ payment: Payment }` | Pago procesado |

### Eventos Cliente → Servidor

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `driver:location` | `{ lat, lng, timestamp }` | Domiciliario emite su posición |
| `chat:send` | `{ content: string }` | Enviar mensaje al chat global |

### Rooms por rol (recomendado)

```typescript
// Al conectar, el servidor une al usuario a su sala de rol
socket.join(`role:${user.role}`)
socket.join(`user:${user.id}`)

// Emitir a todos los cajeros y administradores
io.to('role:cajero').to('role:administrador').emit('order:created', { order })

// Emitir solo al domiciliario específico
io.to(`user:${driverId}`).emit('delivery:created', { delivery })
```

---

## 18. SISTEMA GPS

### Flujo técnico completo

```
Dispositivo del domiciliario
    ↓ navigator.geolocation.watchPosition()
useGPS hook (cada ~5 segundos)
    ↓ emitLocation(lat, lng)
socketService.ts → socket.emit('driver:location', { lat, lng, timestamp })
    ↓ WebSocket
Backend Socket.IO
    ↓ io.to('role:cajero').to('role:administrador').emit('delivery:location', ...)
    ↓ PATCH /api/deliveries/location (para persistir en DB)
Zustand store → updateDriverLocation(update)
    ↓ reactivo
MapaPage → marcadores Leaflet actualizados en tiempo real
```

### Hook useGPS

```typescript
// src/hooks/useGPS.ts
export function useGPS() {
  const user = useAppStore((s) => s.user)

  useEffect(() => {
    if (user?.role !== 'domiciliario') return

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        emitLocation(pos.coords.latitude, pos.coords.longitude)
        deliveriesService.updateLocation(pos.coords.latitude, pos.coords.longitude)
      },
      (err) => console.error('GPS error:', err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [user?.role])
}
```

---

## 19. CHAT INTERNO

### Características técnicas

- Sala global: todos los roles conectados reciben todos los mensajes
- Persistencia temporal: los últimos 100 mensajes se mantienen en el store
- Agrupación visual por fecha
- Indicador de rol con color por emisor
- Contador de no leídos en el badge del BottomNav
- Al entrar al chat: `markAllRead()` ejecutado

### Estructura del mensaje

```typescript
interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  senderRole: Role        // Para mostrar el color del rol
  content: string
  timestamp: string       // ISO 8601
  read: boolean
}
```

---

## 20. ESPECIFICACIÓN PWA COMPLETA

### manifest.json

```json
{
  "name": "El Sazón Uvitano",
  "short_name": "Sazón",
  "description": "Sistema de gestión operativa para restaurante",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#5F290F",
  "background_color": "#FEFEFE",
  "lang": "es-CO",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ],
  "screenshots": [
    { "src": "/screenshots/dashboard.png", "sizes": "390x844", "type": "image/png", "form_factor": "narrow" }
  ]
}
```

### Estrategias de caching (Workbox)

| Estrategia | Recursos |
|------------|----------|
| **Cache First** | CSS, JS, fuentes Google, imágenes estáticas |
| **Network First** | Pedidos, estados de mesas, caja, GPS, domicilios activos |
| **Stale While Revalidate** | Menú/productos, configuración, historial reciente |
| **Network Only** | Pagos, autenticación |

### Configuración vite-plugin-pwa

```typescript
// vite.config.ts
VitePWA({
  registerType: 'autoUpdate',
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/api\.sazonuvitano\.com\/api\/products/,
        handler: 'StaleWhileRevalidate',
        options: { cacheName: 'api-products', expiration: { maxAgeSeconds: 3600 } }
      },
      {
        urlPattern: /^https:\/\/api\.sazonuvitano\.com\/api\/orders/,
        handler: 'NetworkFirst',
        options: { cacheName: 'api-orders' }
      },
      {
        urlPattern: /^https:\/\/{s}\.tile\.openstreetmap\.org/,
        handler: 'CacheFirst',
        options: { cacheName: 'map-tiles', expiration: { maxEntries: 200, maxAgeSeconds: 86400 } }
      }
    ]
  },
  manifest: { /* ver arriba */ }
})
```

---

## 21. INDEXEDDB — OFFLINE PARCIAL

### Configuración Dexie.js

```typescript
// src/indexeddb/db.ts
import Dexie, { Table } from 'dexie'
import type { Product, Order, ChatMessage } from '../types'

interface OfflineOrder {
  id: string
  data: Omit<Order, 'id'>
  createdAt: number
  synced: boolean
}

class SazonDatabase extends Dexie {
  products!: Table<Product>
  offlineOrders!: Table<OfflineOrder>
  messages!: Table<ChatMessage>

  constructor() {
    super('sazon-db')
    this.version(1).stores({
      products:      'id, category, isAvailable',
      offlineOrders: '++id, synced, createdAt',
      messages:      'id, timestamp',
    })
  }
}

export const db = new SazonDatabase()
```

### Datos permitidos en local

| Datos | Justificación | TTL |
|-------|---------------|-----|
| Menú / productos | Offline al tomar pedidos | 1 hora |
| Pedidos temporales | Recuperación sin conexión | Hasta sync |
| Cola offline | Sincronización al reconectar | Hasta sync |
| Últimos mensajes | Historial reciente del chat | 24 horas |

### Datos NO permitidos en local

| Datos | Motivo |
|-------|--------|
| Pagos procesados | Seguridad financiera |
| Historial total | Consistencia de datos |
| Passwords o tokens de terceros | Riesgo de seguridad |
| Datos completos de usuarios | Privacidad |

---

## 22. NOTIFICACIONES PUSH — FCM

### Proveedor: Firebase Cloud Messaging

### Eventos que generan notificación

| Evento | Destinatario | Título | Body |
|--------|-------------|--------|------|
| Nuevo pedido creado | Cajero + Admin | "Nuevo pedido" | "Mesa N° X — $total" |
| Pedido listo | Mesero que lo creó | "Pedido listo" | "Mesa N° X está listo" |
| Nuevo domicilio | Domiciliario asignado | "Nueva entrega asignada" | "Para [cliente] — [dirección]" |
| Mensaje de chat | Todos excepto emisor | "Nuevo mensaje" | "[Rol]: [preview del mensaje]" |
| Pago procesado | Admin | "Pago registrado" | "$monto vía [método]" |

### Registro de service worker para FCM

```typescript
// src/hooks/useNotifications.ts
export function useNotifications() {
  useEffect(() => {
    if (!('Notification' in window)) return

    Notification.requestPermission().then((permission) => {
      if (permission !== 'granted') return

      const messaging = getMessaging(firebaseApp)
      getToken(messaging, { vapidKey: import.meta.env.VITE_FCM_VAPID_KEY })
        .then((token) => {
          // Enviar token al backend para registrar el dispositivo
          authService.registerFCMToken(token)
        })
    })
  }, [])
}
```

---

## 23. CONSTANTES Y CONFIGURACIONES UI

### Estados de pedido

```typescript
export const ORDER_STATUS_CONFIG: Record<OrderStatus, {
  label: string; color: string; textColor: string
  borderColor: string; next?: OrderStatus
}> = {
  tomado:         { label: 'Tomado',         color: 'bg-stone-100',   textColor: 'text-stone-700',  borderColor: 'border-stone-200',  next: 'en_preparacion' },
  en_preparacion: { label: 'En preparación', color: 'bg-orange-100',  textColor: 'text-orange-700', borderColor: 'border-orange-200', next: 'listo' },
  listo:          { label: 'Listo',          color: 'bg-green-100',   textColor: 'text-green-700',  borderColor: 'border-green-200',  next: 'entregado' },
  entregado:      { label: 'Entregado',      color: 'bg-blue-100',    textColor: 'text-blue-700',   borderColor: 'border-blue-200',   next: 'pagado' },
  pagado:         { label: 'Pagado',         color: 'bg-emerald-100', textColor: 'text-emerald-700',borderColor: 'border-emerald-200',next: 'finalizado' },
  finalizado:     { label: 'Finalizado',     color: 'bg-stone-200',   textColor: 'text-stone-600',  borderColor: 'border-stone-300' },
  cancelado:      { label: 'Cancelado',      color: 'bg-red-100',     textColor: 'text-red-700',    borderColor: 'border-red-200' },
}
```

### Métodos de pago

```typescript
export const PAYMENT_METHOD_CONFIG: Record<PaymentMethod, {
  label: string; icon: string; color: string
}> = {
  efectivo:      { label: 'Efectivo',      icon: '💵', color: 'bg-green-50 border-green-200 text-green-700' },
  tarjeta:       { label: 'Tarjeta',       icon: '💳', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  transferencia: { label: 'Transferencia', icon: '🏦', color: 'bg-purple-50 border-purple-200 text-purple-700' },
  nequi:         { label: 'Nequi',         icon: '📱', color: 'bg-violet-50 border-violet-200 text-violet-700' },
  daviplata:     { label: 'Daviplata',     icon: '🔴', color: 'bg-red-50 border-red-200 text-red-700' },
}
```

### Categorías de productos

```typescript
export const CATEGORY_CONFIG: Record<ProductCategory, {
  label: string; icon: string
}> = {
  entrada:         { label: 'Entradas',          icon: '🥗' },
  plato_principal: { label: 'Platos principales', icon: '🍲' },
  bebida:          { label: 'Bebidas',            icon: '🥤' },
  postre:          { label: 'Postres',            icon: '🍮' },
  especial:        { label: 'Especiales',         icon: '⭐' },
  domicilio:       { label: 'Solo domicilio',     icon: '🛵' },
}
```

---

## 24. VALIDACIONES — ZOD SCHEMAS

```typescript
// src/validations/authSchemas.ts
import { z } from 'zod'

export const loginSchema = z.object({
  document: z.string().min(5, 'El documento debe tener al menos 5 caracteres'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export const registerSchema = z.object({
  name:     z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  document: z.string().min(5, 'El documento debe tener al menos 5 caracteres'),
  email:    z.string().email('Email inválido').optional().or(z.literal('')),
  phone:    z.string().regex(/^\+?[0-9]{7,15}$/, 'Teléfono inválido').optional().or(z.literal('')),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  role:     z.enum(['mesero', 'cajero', 'domiciliario', 'administrador']),
})

// src/validations/orderSchemas.ts
export const createOrderSchema = z.object({
  type:    z.enum(['mesa', 'domicilio']),
  tableId: z.string().uuid().optional(),
  items:   z.array(z.object({
    productId: z.string().uuid(),
    quantity:  z.number().int().positive(),
    notes:     z.string().optional(),
  })).min(1, 'El pedido debe tener al menos un producto'),
  notes: z.string().optional(),
})

// src/validations/deliverySchemas.ts
export const createDeliverySchema = z.object({
  customerName:  z.string().min(2),
  customerPhone: z.string().regex(/^\+?[0-9]{7,15}$/),
  street:        z.string().min(5),
  neighborhood:  z.string().optional(),
  reference:     z.string().optional(),
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity:  z.number().int().positive(),
    notes:     z.string().optional(),
  })).min(1),
})
```

---

## 25. HOOKS REUTILIZABLES

```typescript
// src/hooks/useAuth.ts
export function useAuth() {
  const setUser = useAppStore((s) => s.setUser)
  const clearAuth = useAppStore((s) => s.clearAuth)

  const login = async (data: { document: string; password: string }) => {
    const res = await authService.login(data)
    setUser(res.user, res.accessToken)
    localStorage.setItem('sazon-access', res.accessToken)
    localStorage.setItem('sazon-refresh', res.refreshToken)
    initSocket(res.accessToken)
  }

  const logout = async () => {
    await authService.logout()
    clearAuth()
    disconnectSocket()
    localStorage.removeItem('sazon-access')
    localStorage.removeItem('sazon-refresh')
  }

  return { login, logout }
}

// src/hooks/useTables.ts
export function useTables() {
  const setTables = useAppStore((s) => s.setTables)
  return useQuery({
    queryKey: ['tables'],
    queryFn: async () => {
      const data = await tablesService.getAll()
      setTables(data)
      return data
    },
    refetchInterval: 30000, // fallback polling cada 30s
  })
}

// src/hooks/useOnlineStatus.ts
export function useOnlineStatus() {
  const setOnline = useAppStore((s) => s.setOnline)
  useEffect(() => {
    const handleOnline  = () => setOnline(true)
    const handleOffline = () => setOnline(false)
    window.addEventListener('online',  handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online',  handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])
}
```

---

## 26. ESTRUCTURA DE CARPETAS BACKEND

```
server/
├── src/
│   ├── config/
│   │   ├── env.ts               # Variables de entorno validadas con Zod
│   │   ├── database.ts          # PrismaClient singleton
│   │   └── firebase.ts          # Firebase Admin SDK (push notifications)
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.schemas.ts
│   │   │
│   │   ├── users/
│   │   │   ├── users.routes.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.schemas.ts
│   │   │
│   │   ├── tables/
│   │   │   ├── tables.routes.ts
│   │   │   ├── tables.controller.ts
│   │   │   └── tables.service.ts
│   │   │
│   │   ├── products/
│   │   │   ├── products.routes.ts
│   │   │   ├── products.controller.ts
│   │   │   └── products.service.ts
│   │   │
│   │   ├── orders/
│   │   │   ├── orders.routes.ts
│   │   │   ├── orders.controller.ts
│   │   │   ├── orders.service.ts
│   │   │   └── orders.schemas.ts
│   │   │
│   │   ├── payments/
│   │   │   ├── payments.routes.ts
│   │   │   ├── payments.controller.ts
│   │   │   └── payments.service.ts
│   │   │
│   │   ├── deliveries/
│   │   │   ├── deliveries.routes.ts
│   │   │   ├── deliveries.controller.ts
│   │   │   └── deliveries.service.ts
│   │   │
│   │   └── reports/
│   │       ├── reports.routes.ts
│   │       ├── reports.controller.ts
│   │       └── reports.service.ts
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.ts    # Verificar JWT y adjuntar user al request
│   │   ├── role.middleware.ts    # Verificar rol permitido
│   │   ├── validate.middleware.ts# Validar body con Zod schema
│   │   ├── error.middleware.ts   # Handler global de errores
│   │   └── logger.middleware.ts  # Log de requests con Winston
│   │
│   ├── sockets/
│   │   ├── socket.server.ts     # Inicialización Socket.IO + middleware auth
│   │   ├── orders.socket.ts     # Handlers eventos de pedidos
│   │   ├── deliveries.socket.ts # Handlers eventos de domicilios
│   │   └── chat.socket.ts       # Handlers eventos de chat
│   │
│   ├── prisma/
│   │   └── schema.prisma        # Esquema de base de datos
│   │
│   ├── routes/
│   │   └── index.ts             # Router principal que monta todos los módulos
│   │
│   ├── services/
│   │   └── fcm.service.ts       # Servicio de notificaciones push FCM
│   │
│   ├── repositories/
│   │   └── (Opcional) Capa de abstracción sobre Prisma
│   │
│   ├── logs/
│   │   ├── combined.log         # Todos los logs
│   │   └── error.log            # Solo errores
│   │
│   ├── utils/
│   │   ├── jwt.ts               # Firmar y verificar tokens
│   │   ├── hash.ts              # Bcrypt helpers
│   │   └── pagination.ts        # Helper de paginación
│   │
│   └── app.ts                   # Express app: middlewares + rutas + error handler
│
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts                  # Datos iniciales (admin default, mesas, productos)
│   └── migrations/
│
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 27. SEGURIDAD

### Backend — Obligatorio

| Medida | Implementación |
|--------|---------------|
| HTTPS | Let's Encrypt + Nginx SSL termination |
| Autenticación | JWT Access (15min) + Refresh (7 días) |
| Passwords | bcryptjs (salt rounds: 12) |
| Headers seguridad | Helmet.js |
| CORS | Whitelist de dominios permitidos |
| Rate limiting | express-rate-limit (100 req/15min por IP) |
| Sanitización | Validación Zod en todos los endpoints |
| SQL Injection | Prisma ORM (queries parametrizadas) |
| Variables sensibles | `.env` + Docker secrets |
| WebSocket auth | JWT verificado en middleware de conexión |

### Frontend — Obligatorio

| Medida | Implementación |
|--------|---------------|
| Content Security Policy | Headers en Nginx |
| XSS | React escapa por defecto, no usar `dangerouslySetInnerHTML` |
| Almacenamiento seguro | No guardar datos sensibles en localStorage/IndexedDB |
| Validación | Zod en todos los formularios antes de enviar |
| Token management | Access token en memoria/localStorage, refresh en httpOnly cookie (recomendado) |

---

## 28. ESTÁNDARES DE CALIDAD — LIGHTHOUSE

### Objetivos mínimos

| Métrica | Objetivo |
|---------|---------|
| Performance | ≥ 90 |
| Accessibility | ≥ 95 |
| Best Practices | ≥ 95 |
| SEO | ≥ 90 |
| PWA | 100 |

### Core Web Vitals

| Métrica | Objetivo |
|---------|---------|
| LCP (Largest Contentful Paint) | < 2.5s |
| INP (Interaction to Next Paint) | < 200ms |
| CLS (Cumulative Layout Shift) | < 0.1 |
| FCP (First Contentful Paint) | < 1.8s |
| TTFB (Time to First Byte) | < 800ms |

### Optimizaciones requeridas

- Code splitting por ruta con React.lazy + Suspense
- Lazy loading de imágenes (`loading="lazy"`)
- Compresión Gzip/Brotli en Nginx
- Cache-Control headers apropiados por tipo de recurso
- Fuentes preconectadas con `<link rel="preconnect">`
- Tree shaking automático con Vite
- Bundle size < 250KB initial JS (gzipped)
- Tiles de mapa con caché de 24 horas

---

## 29. LOGGING Y MONITOREO

### Winston — Niveles de log

| Nivel | Eventos |
|-------|---------|
| `error` | Errores 500, fallos de BD, crashes |
| `warn` | Intentos fallidos de auth, rate limits |
| `info` | Login exitoso, pagos, pedidos creados |
| `debug` | Queries SQL, socket events (solo desarrollo) |

### Logs obligatorios

- Autenticación: login exitoso, fallido, logout, refresh
- Pedidos: creación, cambios de estado, cancelaciones
- Pagos: procesamiento, monto, método
- Domicilios: creación, asignación, entrega, GPS updates
- WebSockets: conexión, desconexión, eventos críticos
- Errores: stack trace completo + request context

### Monitoreo recomendado

| Herramienta | Uso |
|-------------|-----|
| Uptime Kuma | Monitor de uptime del servidor |
| Grafana + Prometheus | Métricas de CPU, RAM, latencia |
| Sentry | Error tracking en producción |

---

## 30. TESTING

### Unit Testing — Vitest

Cobertura mínima: **80%**

```
src/
├── validations/*.test.ts     # Zod schemas
├── utils/*.test.ts           # Helpers
├── services/*.test.ts        # Servicios API (mocked)
└── store/*.test.ts           # Zustand slices
```

### E2E Testing — Playwright

Flujos críticos a cubrir:

1. Login con credenciales válidas → redirección a dashboard
2. Login con credenciales inválidas → mensaje de error
3. Mesero: crear pedido completo en mesa disponible
4. Cajero: avanzar estados de pedido hasta cobro
5. Cobrar pedido con efectivo y calcular cambio
6. Admin: crear nuevo usuario con rol
7. Admin: crear nuevo producto en el menú
8. Chat: enviar y recibir mensajes

---

## 31. CI/CD PIPELINE

### GitHub Actions — Flujo obligatorio

```yaml
# .github/workflows/main.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check

  test:
    needs: lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:e2e

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: frontend/dist

  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to VPS
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/sazon-uvitano
            git pull origin main
            docker compose pull
            docker compose up -d --build
            docker compose exec backend npx prisma migrate deploy
```

### Git Flow

```
main        → producción (protegida, solo merge desde develop)
develop     → integración (CI/CD a staging)
feature/*   → nuevas funcionalidades
hotfix/*    → correcciones urgentes en producción
```

---

## 32. CONTENERIZACIÓN DOCKER

### docker-compose.yml

```yaml
version: '3.9'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3001:80"
    depends_on:
      - backend
    networks:
      - sazon-network

  backend:
    build:
      context: ./server
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: ${DATABASE_URL}
      JWT_SECRET: ${JWT_SECRET}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
      NODE_ENV: production
    depends_on:
      - postgres
    networks:
      - sazon-network
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: sazon_db
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - sazon-network
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
      - certbot_data:/var/www/certbot
    depends_on:
      - frontend
      - backend
    networks:
      - sazon-network
    restart: unless-stopped

volumes:
  postgres_data:
  certbot_data:

networks:
  sazon-network:
    driver: bridge
```

### Dockerfile Frontend

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/spa.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

### Dockerfile Backend

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npx prisma generate

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
EXPOSE 3000
CMD ["node", "dist/app.js"]
```

---

## 33. DEPLOY PRODUCTIVO

### Arquitectura de producción

```
Internet
    ↓
Cloudflare (CDN + DDoS protection + DNS)
    ↓ HTTPS
VPS Ubuntu 24.04 LTS
    ↓
Nginx (reverse proxy + SSL termination + gzip)
    ├── /            → Frontend React (estáticos)
    ├── /api/*       → Backend Express :3000
    └── /socket.io/* → Socket.IO :3000
```

### Configuración Nginx

```nginx
# /etc/nginx/nginx.conf

upstream backend {
    server backend:3000;
}

server {
    listen 80;
    server_name sazonuvitano.com api.sazonuvitano.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name sazonuvitano.com;

    ssl_certificate     /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;

    gzip on;
    gzip_types text/plain application/javascript application/json text/css;
    gzip_min_length 1000;

    # SPA routing
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # Assets estáticos con caché agresivo
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
        root /usr/share/nginx/html;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

server {
    listen 443 ssl http2;
    server_name api.sazonuvitano.com;

    ssl_certificate     /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;

    location / {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Servidor recomendado

| Recurso | Mínimo | Recomendado |
|---------|--------|-------------|
| CPU | 2 vCPU | 4 vCPU |
| RAM | 2 GB | 4 GB |
| SSD | 40 GB | 80 GB |
| Red | 100 Mbps | 1 Gbps |
| OS | Ubuntu 22.04 LTS | Ubuntu 24.04 LTS |

**Proveedores recomendados:** Hetzner Cloud (mejor precio/rendimiento para Colombia), DigitalOcean, AWS Lightsail.

---

## 34. VARIABLES DE ENTORNO

### Frontend — `.env`

```env
VITE_API_URL=https://api.sazonuvitano.com
VITE_SOCKET_URL=https://api.sazonuvitano.com
VITE_FCM_VAPID_KEY=your_vapid_key_here
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=sazon-uvitano.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=sazon-uvitano
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### Backend — `.env`

```env
# Base de datos
DATABASE_URL=postgresql://user:password@postgres:5432/sazon_db

# JWT
JWT_SECRET=super_secret_key_min_32_characters
JWT_REFRESH_SECRET=another_super_secret_refresh_key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Servidor
PORT=3000
NODE_ENV=production

# CORS
CORS_ORIGIN=https://sazonuvitano.com

# Firebase Admin
FIREBASE_PROJECT_ID=sazon-uvitano
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@sazon-uvitano.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 35. BACKUPS Y DISPONIBILIDAD

### Estrategia de backups PostgreSQL

```bash
# Backup diario automático (cron)
0 2 * * * docker exec sazon-postgres pg_dump -U $DB_USER sazon_db | gzip > /backups/sazon_$(date +%Y%m%d).sql.gz

# Retención: 30 días mínimo
# Almacenamiento externo: AWS S3 o similar
```

| Tipo | Frecuencia | Retención |
|------|------------|-----------|
| Full backup | Diario (2am) | 30 días |
| Incremental | Cada 6 horas | 7 días |
| Transaccional (WAL) | Continuo | 24 horas |

### Objetivo de disponibilidad

- **Uptime:** 99.9% (máximo 8.7 horas de downtime/año)
- **RTO** (Recovery Time Objective): < 1 hora
- **RPO** (Recovery Point Objective): < 6 horas

---

## 36. ESTÁNDARES DE CÓDIGO

### Frontend

| Principio | Implementación |
|-----------|---------------|
| Componentes desacoplados | Props tipadas, sin lógica de negocio en UI |
| Atomic Design | atoms → molecules → organisms → pages |
| Hooks reutilizables | Lógica en hooks, no en componentes |
| Lazy loading | Todas las páginas con React.lazy |
| No magic strings | Constantes tipadas para estados, roles, métodos |
| Tipado estricto | `strict: true` en tsconfig.json |
| Nombres en español | Módulos de negocio (pedido, mesa, caja) en español |
| Nombres en inglés | Componentes genéricos (Button, Input, Modal) en inglés |

### Backend

| Principio | Implementación |
|-----------|---------------|
| Arquitectura modular | Un módulo por dominio |
| Clean code | Funciones < 30 líneas, una responsabilidad |
| SOLID | Single responsibility en cada clase/función |
| Repository pattern | Separación Prisma ↔ lógica de negocio |
| DTO pattern | Schemas Zod como DTOs en cada endpoint |
| Error handling | Middleware centralizado de errores |
| No try/catch anidados | Un try/catch por función de servicio |

### Linting y formato

```json
// .eslintrc.js
{
  "extends": ["eslint:recommended", "@typescript-eslint/recommended", "prettier"],
  "rules": {
    "no-console": "warn",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "error"
  }
}
```

---

## 37. ACCESIBILIDAD

### Requisitos WCAG 2.1 nivel AA

| Requisito | Implementación |
|-----------|---------------|
| Contraste de color | Ratio mínimo 4.5:1 para texto normal, 3:1 para texto grande |
| Touch targets | Mínimo 44×44px en todos los elementos interactivos |
| Labels en formularios | `<label>` explícito o `aria-label` en cada input |
| Roles semánticos | `<nav>`, `<main>`, `<header>`, `<button>`, `<form>` |
| Focus visible | `focus:ring-2 focus:ring-amber-200` en todos los interactivos |
| Texto alternativo | `alt` en todas las imágenes con descripción real |
| Navegación por teclado | Todos los flujos navegables con Tab + Enter/Space |
| ARIA live regions | Para notificaciones y cambios de estado dinámicos |

---

## 38. CRITERIOS DE ACEPTACIÓN

El sistema será considerado listo para producción únicamente cuando se cumplan **todos** los siguientes criterios:

### PWA

- [ ] La aplicación es instalable en Android e iOS
- [ ] Funciona en modo standalone (sin barra del navegador)
- [ ] Lighthouse PWA score = 100
- [ ] Funciona offline parcialmente (menú y pedidos temporales)
- [ ] Splash screen visible al abrir la app instalada
- [ ] Íconos adaptativos correctos

### Funcionalidad

- [ ] Login con JWT funciona correctamente para los 4 roles
- [ ] Refresh token automático sin interrumpir la sesión
- [ ] Mesas se actualizan en tiempo real via Socket.IO
- [ ] Pedidos fluyen correctamente por todos los estados
- [ ] Pago se procesa con cálculo de cambio correcto
- [ ] Domicilio fluye desde creación hasta entrega
- [ ] GPS del domiciliario se refleja en el mapa en < 5 segundos
- [ ] Chat funciona en tiempo real para todos los roles
- [ ] Notificaciones push llegan correctamente
- [ ] Admin puede hacer CRUD completo de usuarios, productos y mesas
- [ ] Reportes muestran datos correctos del día

### Calidad

- [ ] Lighthouse Performance ≥ 90
- [ ] Lighthouse Accessibility ≥ 95
- [ ] Sin errores críticos en consola del navegador
- [ ] Sin memory leaks detectados en DevTools
- [ ] Cobertura de tests ≥ 80%
- [ ] Tests E2E de flujos críticos pasan
- [ ] Sin vulnerabilidades críticas en `npm audit`

### Infraestructura

- [ ] Deploy estable en Docker + Nginx
- [ ] HTTPS configurado con Let's Encrypt
- [ ] Backups automáticos funcionando
- [ ] Logs de Winston registrando correctamente
- [ ] Uptime monitor configurado (Uptime Kuma)
- [ ] Variables de entorno correctamente gestionadas
- [ ] CI/CD pipeline pasa sin errores

---

*Documento generado para el proyecto El Sazón Uvitano PWA*  
*Versión 2.0 — Especificación completa de producción*

