import { HttpException, Injectable } from '@nestjs/common';
import { Board } from '@prisma/client';

import { PrismaService } from '../common/prisma/prisma.service';
import { ValidationService } from '../common/validation/validation.service';
import { BoardCreateRequest, BoardResponse } from '../model/board.model';
import { WorkspaceService } from '../workspace/workspace.service';
import { BoardValidation } from './board.validation';

@Injectable()
export class BoardService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
    private workspaceService: WorkspaceService,
  ) {}

  toBoardResponse(board: Board): BoardResponse {
    return {
      id: board.id,
      workspaceId: board.workspaceId,
      title: board.title,
      description: board.description,
      createdAt: board.createdAt,
      updatedAt: board.createdAt,
    };
  }

  async existingWorkspace(boardId: string): Promise<Board> {
    const board = await this.prismaService.board.findUnique({
      where: { id: boardId },
    });

    if (!board) {
      throw new HttpException('Board not found!', 404);
    }
    return board;
  }

  async create(
    workspaceId: string,
    request: BoardCreateRequest,
  ): Promise<BoardResponse> {
    console.log(
      `BoardService.create - request : (${request.title}, ${request.description}) - workspaceId : (${workspaceId})`,
    );

    await this.workspaceService.existingWorkspace(workspaceId);

    const createRequest = this.validationService.validate(
      BoardValidation.CREATE,
      request,
    );

    const board = await this.prismaService.board.create({
      data: {
        workspaceId: workspaceId,
        ...createRequest,
      },
    });
    return this.toBoardResponse(board);
  }
}
