import { prisma } from '../../config/database.js';
import { hashPassword, comparePassword } from '../../utils/hash.js';
import { createTokenPair, verifyRefreshToken } from '../../utils/jwt.js';
export async function login(document, password) {
    const user = await prisma.user.findUnique({ where: { document } });
    if (!user || !user.isActive)
        throw Object.assign(new Error('Credenciales inválidas'), { status: 401 });
    const valid = await comparePassword(password, user.password);
    if (!valid)
        throw Object.assign(new Error('Credenciales inválidas'), { status: 401 });
    return { user, tokens: createTokenPair(user) };
}
export async function register(data) {
    const exists = await prisma.user.findUnique({ where: { document: data.document } });
    if (exists)
        throw Object.assign(new Error('Documento ya registrado'), { status: 409 });
    const user = await prisma.user.create({
        data: { ...data, password: await hashPassword(data.password) },
    });
    return { user, tokens: createTokenPair(user) };
}
export async function refresh(token) {
    const payload = verifyRefreshToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || !user.isActive)
        throw Object.assign(new Error('Token inválido'), { status: 401 });
    return createTokenPair(user);
}
export async function me(id) {
    const user = await prisma.user.findUniqueOrThrow({ where: { id } });
    const { password: _, ...safe } = user;
    return safe;
}
