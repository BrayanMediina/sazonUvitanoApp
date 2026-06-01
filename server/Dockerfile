FROM node:22-alpine AS builder
WORKDIR /app

COPY server/package*.json ./
RUN npm ci

COPY server/prisma ./prisma
COPY server/src ./src
COPY server/tsconfig.json ./

RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY server/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node_modules/.bin/tsx prisma/seed.ts && node dist/index.js"]
