import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';

export const BoardData = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const board = request.board;
    if (!board) {
      throw new HttpException('Board not found!', 404);
    } else {
      return board;
    }
  },
);
