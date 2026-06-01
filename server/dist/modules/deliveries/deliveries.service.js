import { prisma } from '../../config/database.js';
const INCLUDE = {
    order: { include: { items: { include: { product: true } } } },
    driver: { select: { id: true, name: true, phone: true } },
};
export async function getAll(params) {
    const where = {};
    if (params.status)
        where.status = params.status;
    return prisma.delivery.findMany({ where, include: INCLUDE, orderBy: { createdAt: 'desc' } });
}
export async function getById(id) {
    return prisma.delivery.findUniqueOrThrow({ where: { id }, include: INCLUDE });
}
export async function getMyDeliveries(driverId) {
    return prisma.delivery.findMany({
        where: { driverId },
        include: INCLUDE,
        orderBy: { createdAt: 'desc' },
    });
}
export async function create(data) {
    const products = await prisma.product.findMany({
        where: { id: { in: data.items.map((i) => i.productId) } }
    });
    const orderItems = data.items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product)
            throw Object.assign(new Error(`Producto ${item.productId} no encontrado`), { status: 404 });
        return { productId: item.productId, quantity: item.quantity, unitPrice: product.price, subtotal: product.price * item.quantity, notes: item.notes };
    });
    const total = orderItems.reduce((s, i) => s + i.subtotal, 0);
    const order = await prisma.order.create({
        data: {
            type: 'domicilio',
            total,
            createdBy: data.createdBy,
            status: 'tomado',
            items: { create: orderItems },
        },
    });
    return prisma.delivery.create({
        data: {
            orderId: order.id,
            customerName: data.customerName,
            customerPhone: data.customerPhone,
            street: data.street,
            neighborhood: data.neighborhood,
            reference: data.reference,
            status: 'pendiente',
        },
        include: INCLUDE,
    });
}
export async function assign(id, driverId) {
    return prisma.delivery.update({ where: { id }, data: { driverId, status: 'asignado' }, include: INCLUDE });
}
export async function updateStatus(id, status) {
    return prisma.delivery.update({ where: { id }, data: { status }, include: INCLUDE });
}
export async function updateLocation(driverId, lat, lng) {
    return prisma.delivery.updateMany({
        where: { driverId, status: 'en_camino' },
        data: { currentLat: lat, currentLng: lng },
    });
}
