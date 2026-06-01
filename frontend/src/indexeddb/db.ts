// IndexedDB Database Configuration
// Using Dexie for IndexedDB management

import Dexie, { Table } from 'dexie';

export interface Order {
  id?: string;
  tableId: number;
  items: any[];
  status: string;
  total: number;
  createdAt: Date;
}

export interface Delivery {
  id?: string;
  orderId: string;
  driverId: string;
  address: string;
  status: string;
  createdAt: Date;
}

export class AppDB extends Dexie {
  orders!: Table<Order>;
  deliveries!: Table<Delivery>;

  constructor() {
    super('sazonUvitanoDB');
    this.version(1).stores({
      orders: '++id, tableId, status',
      deliveries: '++id, orderId, driverId, status',
    });
  }
}

export const db = new AppDB();
