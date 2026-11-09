import { PrismaClient } from '@prisma/client';

export class PrismaService extends PrismaClient {
  constructor() {
    super();
  }

  async connectDb() {
    await this.$connect();
    console.log('🌱 Prisma successfully attached to MongoDB Replica Set.');
  }
}
