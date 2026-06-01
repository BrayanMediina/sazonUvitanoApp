import { prisma } from '../../config/database.js';
const INCLUDE = { orders: { where: { status: { in: ['tomado', 'en_preparacion', 'listo', 'entregado'] } }, take: 1 } };
export async function getAll() {
    return prisma.table.findMany({ orderBy: { number: 'asc' } });
}
export async function getById(id) {
    return prisma.table.findUniqueOrThrow({ where: { id } });
}
export async function create(data) {
    const exists = await prisma.table.findUnique({ where: { number: data.number } });
    if (exists)
        throw Object.assign(new Error(`Mesa ${data.number} ya existe`), { status: 409 });
    return prisma.table.create({ data });
}
export async function update(id, data) {
    return prisma.table.update({ where: { id }, data });
}
export async function updateStatus(id, status) {
    return prisma.table.update({ where: { id }, data: { status } });
}
export async function remove(id) {
    const table = await prisma.table.findUniqueOrThrow({ where: { id }, include: INCLUDE });
    if (table.orders.length > 0)
        throw Object.assign(new Error('La mesa tiene un pedido activo'), { status: 422 });
    return prisma.table.delete({ where: { id } });
}
