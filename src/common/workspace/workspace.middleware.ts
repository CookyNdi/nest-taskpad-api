import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkspaceMiddleware implements NestMiddleware {
  constructor(private prismaService: PrismaService) {}

  async use(req: any, res: any, next: () => void) {
    const account = req.account;
    const workspaceId = req.params.workspaceId;

    if (workspaceId) {
      const workspace = await this.prismaService.workspace.findUnique({
        where: { id: workspaceId },
      });
      if (!workspace) {
        throw new HttpException('Workspace not found!', 404);
      }
      if (workspace.accountId !== account.id) {
        throw new HttpException('Unauthorized!', 401);
      }
      if (workspace) {
        req.workspace = workspace;
      }
    }
    next();
  }
}
