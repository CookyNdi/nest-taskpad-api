import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super();
    console.log(`Create prisma service`);
  }
  onModuleDestroy() {
    console.log('Prisma Disconnect');
    this.$disconnect();
  }

  onModuleInit() {
    console.log('Prisma Connect');
    this.$connect();
  }
}
