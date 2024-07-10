import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TaskMiddleware implements NestMiddleware {
  constructor(private prismaService: PrismaService) {}

  async use(req: any, res: any, next: () => void) {
    const boardId = req.params.boardId;
    const taskId = req.params.taskId;
    if (taskId) {
      const task = await this.prismaService.tasks.findUnique({
        where: { id: taskId },
      });
      if (!task) {
        throw new HttpException('Task not found!', 404);
      }
      if (task.boardId !== boardId) {
        throw new HttpException(
          'This Task has no connection to the selected board.',
          400,
        );
      }
      if (task) {
        req.task = task;
      }
    }
    next();
  }
}
