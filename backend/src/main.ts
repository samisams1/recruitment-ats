import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config();


import { AuthService } from './auth/auth.service';
import { authRouter, setupAuthRoutes } from './auth/auth.controller';
import { PrismaService } from '../prisma/prisma.service';

const app = express();
app.use(express.json());

const prismaService = new PrismaService();
const authService = new AuthService(prismaService);

// Bind controller routes
setupAuthRoutes(authService);
app.use('/api/auth', authRouter);

const PORT = process.env.PORT || 9000;

async function bootstrap() {
  try {
    await prismaService.connectDb();
    app.listen(PORT, () => console.log(`🚀 Backend runtime executing smoothly on port ${PORT}`));
  } catch (error) {
    console.error('❌ Server bootstrap crash:', error);
    process.exit(1);
  }
}

bootstrap();
