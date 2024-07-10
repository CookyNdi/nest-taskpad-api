import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';

export const TaskData = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const task = request.task;
    if (!task) {
      throw new HttpException('Task not found!', 404);
    } else {
      return task;
    }
  },
);
