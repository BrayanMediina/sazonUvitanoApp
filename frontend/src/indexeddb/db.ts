import Dexie, { type Table } from 'dexie'
import type { Product, ChatMessage } from '../types'

interface OfflineOrder {
  id?: string
  data: Record<string, unknown>
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
