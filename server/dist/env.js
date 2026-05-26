import { z } from 'zod';
const envSchema = z.object({
    PORT: z.coerce.number().default(4000),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/sazon_uvitano'),
    JWT_SECRET: z.string().default('dev-secret-change-me'),
    JWT_REFRESH_SECRET: z.string().default('dev-refresh-change-me'),
    SOCKET_PORT: z.coerce.number().default(4001)
});
export const env = envSchema.parse(process.env);
