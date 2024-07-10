import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BoardMiddleware implements NestMiddleware {
  constructor(private prismaService: PrismaService) {}

  async use(req: any, res: any, next: () => void) {
    const boardId = req.params.boardId;
    const workspaceId = req.params.workspaceId;

    if (boardId) {
      const board = await this.prismaService.board.findUnique({
        where: { id: boardId },
      });
      if (!board) {
        throw new HttpException('Board not found!', 404);
      }
      if (board.workspaceId !== workspaceId) {
        throw new HttpException(
          'This board has no connection to the selected workspace.',
          400,
        );
      }
      if (board) {
        req.board = board;
      }
    }
    next();
  }
}
