// ============================================================
// SERVICIOS API — El Sazón Uvitano PWA
// src/services/api.ts
// ============================================================
import type {
  AuthResponse, User, Table, Order,
  Product, Payment, Delivery, DailySummary,
  PaginatedResponse, PaymentMethod, Role, ChatMessage
} from '../types'
import type {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from '@simplewebauthn/browser'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

// Omite keys con valor undefined/null para evitar "?category=undefined" en la URL
function toQuery(params: Record<string, unknown>): string {
  const sp = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) sp.set(k, String(v))
  }
  const s = sp.toString()
  return s ? `?${s}` : ''
}

// ─── CLIENTE HTTP BASE ────────────────────────────────────────
async function http<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('sazon-access')
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (res.status === 401 && !path.startsWith('/api/auth/')) {
    // Solo intentar refresh para endpoints protegidos, no para login/register
    const refreshed = await refreshToken()
    if (!refreshed) {
      localStorage.removeItem('sazon-access')
      localStorage.removeItem('sazon-refresh')
      window.location.href = '/login'
      throw new Error('Sesión expirada')
    }
    return http<T>(path, options)
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Servidor no disponible. Intenta de nuevo en unos segundos.' }))
    throw new Error(err.message ?? 'Error en la solicitud')
  }

  const json = await res.json()
  // El backend envuelve respuestas en { success, data }.
  // Si existe .data, lo extraemos; si no (ej. logout), devolvemos el objeto completo.
  return (json && typeof json === 'object' && 'data' in json ? json.data : json) as T
}

// ─── AUTH ─────────────────────────────────────────────────────
export const authService = {
  login: (body: { document: string; password: string }) =>
    http<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  register: (body: {
    name: string; document: string; email?: string;
    phone?: string; password: string; role: Role
  }) =>
    http<{ user: User; pendingActivation: boolean }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  logout: () =>
    http<void>('/api/auth/logout', { method: 'POST' }),

  me: () =>
    http<User>('/api/auth/me'),

  face: {
    enroll: (descriptor: number[]) =>
      http<{ enrolled: boolean }>('/api/auth/face/enroll', {
        method: 'POST', body: JSON.stringify({ descriptor }),
      }),

    verify: (document: string, descriptor: number[]) =>
      http<AuthResponse>('/api/auth/face/verify', {
        method: 'POST', body: JSON.stringify({ document, descriptor }),
      }),

    hasDescriptor: () =>
      http<{ hasDescriptor: boolean }>('/api/auth/face/has-descriptor'),
  },

  webauthn: {
    registrationOptions: () =>
      http<PublicKeyCredentialCreationOptionsJSON>('/api/auth/webauthn/register-options', { method: 'POST' }),

    registrationVerify: (body: unknown) =>
      http<{ verified: boolean }>('/api/auth/webauthn/register-verify', {
        method: 'POST', body: JSON.stringify(body),
      }),

    loginOptions: (document: string) =>
      http<{ options: PublicKeyCredentialRequestOptionsJSON; userId: string }>('/api/auth/webauthn/login-options', {
        method: 'POST', body: JSON.stringify({ document }),
      }),

    loginVerify: (userId: string, response: unknown) =>
      http<AuthResponse>('/api/auth/webauthn/login-verify', {
        method: 'POST', body: JSON.stringify({ userId, response }),
      }),

    hasCredential: () =>
      http<{ hasCredential: boolean }>('/api/auth/webauthn/has-credential'),
  },
}

async function refreshToken(): Promise<boolean> {
  try {
    const refresh = localStorage.getItem('sazon-refresh')
    if (!refresh) return false
    const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: refresh }),
    })
    if (!res.ok) return false
    const body = await res.json()
    // El backend envuelve en { success, data: { accessToken, refreshToken } }
    const tokens = (body?.data ?? body) as { accessToken: string; refreshToken: string }
    if (!tokens?.accessToken) return false
    localStorage.setItem('sazon-access', tokens.accessToken)
    localStorage.setItem('sazon-refresh', tokens.refreshToken)
    return true
  } catch {
    return false
  }
}

// ─── USUARIOS (Admin) ─────────────────────────────────────────
export const usersService = {
  getAll: (params?: { role?: Role; page?: number; limit?: number }) =>
    http<PaginatedResponse<User>>(`/api/users${toQuery(params ?? {})}`),

  getById: (id: string) =>
    http<User>(`/api/users/${id}`),

  create: (body: Partial<User> & { password: string }) =>
    http<User>('/api/users', { method: 'POST', body: JSON.stringify(body) }),

  update: (id: string, body: Partial<User>) =>
    http<User>(`/api/users/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),

  toggleActive: (id: string) =>
    http<User>(`/api/users/${id}/toggle-active`, { method: 'PATCH' }),

  resetPassword: (id: string, newPassword: string) =>
    http<void>(`/api/users/${id}/reset-password`, {
      method: 'PATCH',
      body: JSON.stringify({ newPassword }),
    }),
}

// ─── MESAS ────────────────────────────────────────────────────
export const tablesService = {
  getAll: () =>
    http<Table[]>('/api/tables'),

  getById: (id: string) =>
    http<Table>(`/api/tables/${id}`),

  create: (body: { number: number; capacity?: number; zone?: string }) =>
    http<Table>('/api/tables', { method: 'POST', body: JSON.stringify(body) }),

  update: (id: string, body: Partial<Table>) =>
    http<Table>(`/api/tables/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),

  updateStatus: (id: string, status: Table['status']) =>
    http<Table>(`/api/tables/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  delete: (id: string) =>
    http<void>(`/api/tables/${id}`, { method: 'DELETE' }),
}

// ─── PRODUCTOS ────────────────────────────────────────────────
export const productsService = {
  getAll: (params?: { category?: string; isAvailable?: boolean }) =>
    http<Product[]>(`/api/products${toQuery(params ?? {})}`),

  getById: (id: string) =>
    http<Product>(`/api/products/${id}`),

  create: (body: Omit<Product, 'id'>) =>
    http<Product>('/api/products', { method: 'POST', body: JSON.stringify(body) }),

  update: (id: string, body: Partial<Product>) =>
    http<Product>(`/api/products/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),

  toggleAvailability: (id: string) =>
    http<Product>(`/api/products/${id}/toggle-availability`, { method: 'PATCH' }),

  delete: (id: string) =>
    http<void>(`/api/products/${id}`, { method: 'DELETE' }),
}

// ─── PEDIDOS ──────────────────────────────────────────────────
export const ordersService = {
  getAll: (params?: { status?: string; tableId?: string; type?: string }) =>
    http<Order[]>(`/api/orders${toQuery(params ?? {})}`),

  getById: (id: string) =>
    http<Order>(`/api/orders/${id}`),

  create: (body: {
    type: 'mesa' | 'domicilio'
    tableId?: string
    items: { productId: string; quantity: number; notes?: string }[]
    notes?: string
  }) =>
    http<Order>('/api/orders', { method: 'POST', body: JSON.stringify(body) }),

  updateStatus: (id: string, status: Order['status']) =>
    http<Order>(`/api/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  addItem: (orderId: string, item: { productId: string; quantity: number; notes?: string }) =>
    http<Order>(`/api/orders/${orderId}/items`, {
      method: 'POST',
      body: JSON.stringify(item),
    }),

  removeItem: (orderId: string, itemId: string) =>
    http<Order>(`/api/orders/${orderId}/items/${itemId}`, { method: 'DELETE' }),

  cancel: (id: string) =>
    http<Order>(`/api/orders/${id}/cancel`, { method: 'PATCH' }),
}

// ─── PAGOS ────────────────────────────────────────────────────
export const paymentsService = {
  processPayment: (body: {
    orderId: string
    method: PaymentMethod
    receivedAmount?: number
  }) =>
    http<Payment>('/api/payments', { method: 'POST', body: JSON.stringify(body) }),

  getDailyReport: (date?: string) =>
    http<DailySummary>(`/api/payments/report/daily${date ? `?date=${date}` : ''}`),

  getHistory: (params?: { from?: string; to?: string; page?: number }) =>
    http<PaginatedResponse<Payment>>(`/api/payments${toQuery(params ?? {})}`),
}

// ─── DOMICILIOS ───────────────────────────────────────────────
export const deliveriesService = {
  getAll: (params?: { status?: string }) =>
    http<Delivery[]>(`/api/deliveries${toQuery(params ?? {})}`),

  getById: (id: string) =>
    http<Delivery>(`/api/deliveries/${id}`),

  getMyDeliveries: () =>
    http<Delivery[]>('/api/deliveries/my'),

  getAvailableDrivers: () =>
    http<{ id: string; name: string; phone?: string }[]>('/api/deliveries/available-drivers'),

  create: (body: {
    customerName: string
    customerPhone: string
    street: string
    neighborhood?: string
    reference?: string
    items: { productId: string; quantity: number; notes?: string }[]
  }) =>
    http<Delivery>('/api/deliveries', { method: 'POST', body: JSON.stringify(body) }),

  assign: (id: string, driverId: string) =>
    http<Delivery>(`/api/deliveries/${id}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ driverId }),
    }),

  updateStatus: (id: string, status: Delivery['status']) =>
    http<Delivery>(`/api/deliveries/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  updateLocation: (lat: number, lng: number) =>
    http<void>('/api/deliveries/location', {
      method: 'PATCH',
      body: JSON.stringify({ lat, lng }),
    }),
}

// ─── CHAT ─────────────────────────────────────────────────────
export const chatService = {
  getMessages: () => http<ChatMessage[]>('/api/chat'),
}

// ─── REPORTES ─────────────────────────────────────────────────
export const reportsService = {
  getDaily: (date?: string) =>
    http<DailySummary>(`/api/reports/daily${date ? `?date=${date}` : ''}`),

  getRange: (from: string, to: string) =>
    http<DailySummary[]>(`/api/reports/range?from=${from}&to=${to}`),

  closeDia: (date?: string) =>
    http<DailySummary & { closedAt: string }>(`/api/reports/cierre${date ? `?date=${date}` : ''}`, {
      method: 'POST',
    }),
}