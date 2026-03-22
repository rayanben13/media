import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL as string,
    });
    super({ adapter, log: ['query'] });
  }

  // عند بدء الموديول
  async onModuleInit() {
    await this.$connect();
  }

  // عند تدمير الموديول
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
