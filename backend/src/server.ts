import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import prisma from './config/prisma';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

const server = app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
  console.log(`[server]: Health check available at http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
const shutdown = async () => {
  console.log('[server]: Shutting down server...');
  server.close(async () => {
    await prisma.$disconnect();
    console.log('[server]: Prisma disconnected. Server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export default server;
