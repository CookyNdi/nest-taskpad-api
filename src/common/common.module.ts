import { Global, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import { PrismaService } from './prisma/prisma.service';
import { ValidationService } from './validation/validation.service';
import { ErrorFilter } from './error/error.filter';

@Global()
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [
    PrismaService,
    ValidationService,
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
  ],
  exports: [PrismaService, ValidationService],
})
export class CommonModule {}
