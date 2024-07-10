import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';

export const WorkspaceData = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const workspace = request.workspace;
    if (!workspace) {
      throw new HttpException('Workspace not found!', 404);
    }
    return workspace;
  },
);
