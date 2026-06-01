import { prisma } from '../../config/database.js';
const ITEM_INCLUDE = {
    items: {
        include: { product: true },
    },
    table: true,
    creator: { select: { id: true, name: true } },
};
export async function getAll(params) {
    const where = {};
    if (params.status)
        where.status = params.status;
    if (params.tableId)
        where.tableId = params.tableId;
    if (params.type)
        where.type = params.type;
    return prisma.order.findMany({ where, include: ITEM_INCLUDE, orderBy: { createdAt: 'desc' } });
}
export async function getById(id) {
    return prisma.order.findUniqueOrThrow({ where: { id }, include: ITEM_INCLUDE });
}
export async function create(data) {
    const products = await prisma.product.findMany({
        where: { id: { in: data.items.map((i) => i.productId) } }
    });
    const itemsWithPrice = data.items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product)
            throw Object.assign(new Error(`Producto ${item.productId} no encontrado`), { status: 404 });
        return {
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: product.price,
            subtotal: product.price * item.quantity,
            notes: item.notes,
        };
    });
    const total = itemsWithPrice.reduce((s, i) => s + i.subtotal, 0);
    const order = await prisma.order.create({
        data: {
            type: data.type,
            tableId: data.tableId,
            notes: data.notes,
            total,
            createdBy: data.createdBy,
            status: 'tomado',
            items: { create: itemsWithPrice },
        },
        include: ITEM_INCLUDE,
    });
    if (data.tableId) {
        await prisma.table.update({ where: { id: data.tableId }, data: { status: 'ocupada', currentOrderId: order.id } });
    }
    return order;
}
export async function updateStatus(id, status) {
    const order = await prisma.order.update({ where: { id }, data: { status }, include: ITEM_INCLUDE });
    if (status === 'pagado' || status === 'finalizado' || status === 'cancelado') {
        if (order.tableId) {
            await prisma.table.update({ where: { id: order.tableId }, data: { status: 'disponible', currentOrderId: null } });
        }
    }
    else if (status === 'entregado' && order.tableId) {
        await prisma.table.update({ where: { id: order.tableId }, data: { status: 'pendiente_pago' } });
    }
    return order;
}
export async function addItem(orderId, item) {
    const product = await prisma.product.findUniqueOrThrow({ where: { id: item.productId } });
    const newItem = await prisma.orderItem.create({
        data: {
            orderId,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: product.price,
            subtotal: product.price * item.quantity,
            notes: item.notes,
        },
    });
    const items = await prisma.orderItem.findMany({ where: { orderId } });
    const total = items.reduce((s, i) => s + i.subtotal, 0);
    await prisma.order.update({ where: { id: orderId }, data: { total } });
    return newItem;
}
export async function removeItem(orderId, itemId) {
    await prisma.orderItem.delete({ where: { id: itemId } });
    const items = await prisma.orderItem.findMany({ where: { orderId } });
    const total = items.reduce((s, i) => s + i.subtotal, 0);
    return prisma.order.update({ where: { id: orderId }, data: { total }, include: ITEM_INCLUDE });
}
export async function cancel(id) {
    return updateStatus(id, 'cancelado');
}
