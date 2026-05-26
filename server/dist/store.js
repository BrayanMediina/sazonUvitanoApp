import bcrypt from 'bcryptjs';
const adminHash = bcrypt.hashSync('123456', 10);
export const store = {
    users: [
        { id: 'user-admin', name: 'Administrador Sazón', email: 'admin@sazonuvitano.com', role: 'admin', passwordHash: adminHash }
    ],
    tables: [
        { id: 'table-1', number: 1, status: 'Disponible', seats: 4 },
        { id: 'table-2', number: 2, status: 'Ocupada', seats: 2 },
        { id: 'table-3', number: 3, status: 'Pendiente pago', seats: 6 }
    ],
    products: [
        { id: 'product-1', name: 'Ceviche', price: 28000, category: 'Platos' },
        { id: 'product-2', name: 'Pasta al pesto', price: 24000, category: 'Platos' }
    ],
    orders: [
        {
            id: 'order-1',
            tableId: 'table-2',
            status: 'En preparación',
            total: 48000,
            createdAt: new Date().toISOString(),
            items: [{ productId: 'product-1', name: 'Ceviche', quantity: 1, price: 28000 }]
        }
    ],
    deliveries: [
        { id: 'delivery-1', orderId: 'order-1', driverId: 'driver-1', status: 'En camino', currentLat: 4.6987, currentLng: -74.1113, createdAt: new Date().toISOString() }
    ],
    payments: []
};
export function getUserByEmail(email) {
    return store.users.find((user) => user.email === email);
}
export function upsertTable(table) {
    const index = store.tables.findIndex((item) => item.id === table.id);
    if (index >= 0)
        store.tables[index] = table;
    else
        store.tables.push(table);
}
export function createOrder(order) {
    store.orders.push(order);
}
export function updateOrder(id, patch) {
    const index = store.orders.findIndex((order) => order.id === id);
    if (index >= 0)
        store.orders[index] = { ...store.orders[index], ...patch };
}
export function createDelivery(delivery) {
    store.deliveries.push(delivery);
}
export function updateDelivery(id, patch) {
    const index = store.deliveries.findIndex((delivery) => delivery.id === id);
    if (index >= 0)
        store.deliveries[index] = { ...store.deliveries[index], ...patch };
}
export function createPayment(payment) {
    store.payments.push(payment);
}
export function createProduct(product) {
    store.products.push(product);
}
