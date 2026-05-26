FROM node:22-alpine AS builder
WORKDIR /app

COPY server/package*.json ./
RUN npm install

COPY server/prisma ./prisma
COPY server/src ./src
COPY server/tsconfig.json ./

RUN npm run prisma:generate
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY server/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 4000
CMD ["sh", "-c", "npm run prisma:migrate:deploy && node dist/index.js"]
