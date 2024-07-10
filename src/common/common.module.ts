import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import { PrismaService } from './prisma/prisma.service';
import { ValidationService } from './validation/validation.service';
import { ErrorFilter } from './error/error.filter';
import { AuthMiddleware } from './auth/auth.middleware';
import { TaskController } from '../task/task.controller';
import { WorkspaceMiddleware } from './workspace/workspace.middleware';
import { BoardMiddleware } from './board/board.middleware';
import { TaskMiddleware } from './task/task.middleware';
import { WorkspaceController } from '../workspace/workspace.controller';
import { BoardController } from '../board/board.controller';

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
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('/api/*');
    consumer.apply(WorkspaceMiddleware).forRoutes(WorkspaceController);
    consumer
      .apply(WorkspaceMiddleware, BoardMiddleware)
      .forRoutes(BoardController);
    consumer
      .apply(WorkspaceMiddleware, BoardMiddleware, TaskMiddleware)
      .forRoutes(TaskController);
  }
}
