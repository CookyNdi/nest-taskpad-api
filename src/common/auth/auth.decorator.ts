import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';

export const Auth = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const account = request.account;
    if (account) {
      return account;
    } else {
      throw new HttpException('Unauthorized!', 401);
    }
  },
);
