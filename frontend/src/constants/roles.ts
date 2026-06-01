// Roles and permissions configuration

export const roles = {
  admin: {
    name: 'Administrador',
    permissions: ['view_all', 'create', 'edit', 'delete', 'manage_users'],
  },
  cashier: {
    name: 'Cajero',
    permissions: ['view_orders', 'process_payments', 'close_cash'],
  },
  waiter: {
    name: 'Mesero',
    permissions: ['view_tables', 'create_orders', 'edit_orders'],
  },
  driver: {
    name: 'Domiciliario',
    permissions: ['view_deliveries', 'update_delivery_status', 'view_map'],
  },
  kitchen: {
    name: 'Cocina',
    permissions: ['view_orders', 'update_order_status'],
  },
};

export type Role = keyof typeof roles;
