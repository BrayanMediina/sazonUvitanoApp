import { appConfig, type Role } from '../config'
import { enqueueOfflineItem } from './offline'

interface LoginRequest {
  email: string
  password: string
}

interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    name: string
    email: string
    role: Role
  }
}

const defaultHeaders = () => ({
  'Content-Type': 'application/json'
})

async function jsonRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${appConfig.apiUrl}${path}`, {
    ...options,
    headers: {
      ...defaultHeaders(),
      ...options?.headers
    }
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || `Error al consumir ${path}`)
  }

  return (await response.json()) as T
}

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  return jsonRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export async function refreshToken(refreshToken: string): Promise<AuthResponse> {
  return jsonRequest<AuthResponse>('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken })
  })
}

export async function logout() {
  return jsonRequest<{ ok: true }>('/auth/logout', {
    method: 'POST'
  })
}

export async function fetchDashboardSummary() {
  return jsonRequest('/reports/summary')
}

export async function fetchTables() {
  return jsonRequest('/tables')
}

export async function createOrder(payload: unknown) {
  if (!navigator.onLine) {
    await enqueueOfflineItem({
      id: crypto.randomUUID(),
      type: 'order',
      payload,
      createdAt: new Date().toISOString()
    })
    return { queued: true }
  }

  return jsonRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export async function createPayment(payload: unknown) {
  return jsonRequest('/payments', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export async function createDelivery(payload: unknown) {
  return jsonRequest('/deliveries', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export async function getDailyReport() {
  return jsonRequest('/payments/report/daily')
}
