FROM node:22-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Только если есть Prisma (prisma/schema.prisma). Без Prisma удалите эту строку.
# Фиктивный URL нужен, потому что Prisma 7 не выполняет generate без DATABASE_URL.
RUN DATABASE_URL=postgresql://u:p@localhost:5432/db DIRECT_URL=postgresql://u:p@localhost:5432/db npx prisma generate


EXPOSE 5000
CMD ["npm", "start"]