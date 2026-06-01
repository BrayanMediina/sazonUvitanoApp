import { prisma } from '../../config/database.js';
export async function getAll(params) {
    const where = { isActive: true };
    if (params.category)
        where.category = params.category;
    if (params.isAvailable === 'true')
        where.isAvailable = true;
    return prisma.product.findMany({ where, orderBy: [{ category: 'asc' }, { name: 'asc' }] });
}
export async function getById(id) {
    return prisma.product.findUniqueOrThrow({ where: { id } });
}
export async function create(data) {
    return prisma.product.create({ data: { ...data, isActive: true } });
}
export async function update(id, data) {
    return prisma.product.update({ where: { id }, data });
}
export async function toggleAvailability(id) {
    const p = await prisma.product.findUniqueOrThrow({ where: { id } });
    return prisma.product.update({ where: { id }, data: { isAvailable: !p.isAvailable } });
}
export async function remove(id) {
    return prisma.product.delete({ where: { id } });
}
