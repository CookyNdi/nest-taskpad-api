import { HttpException, Injectable } from '@nestjs/common';
import { Board } from '@prisma/client';

import { PrismaService } from '../common/prisma/prisma.service';
import { ValidationService } from '../common/validation/validation.service';
import {
  BoardCreateRequest,
  BoardResponse,
  BoardUpdateRequest,
} from '../model/board.model';
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

  async existingBoard(boardId: string): Promise<Board> {
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

    const createRequest: BoardCreateRequest = this.validationService.validate(
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

  async update(
    workspaceId: string,
    request: BoardUpdateRequest,
    boardId: string,
  ): Promise<BoardResponse> {
    console.log(
      `BoardService.update - request : (${request.title}, ${request.description}) - workspaceId : (${workspaceId}) - boardId : (${boardId})`,
    );

    await this.workspaceService.existingWorkspace(workspaceId);
    let board = await this.existingBoard(boardId);

    const updateRequest: BoardUpdateRequest = this.validationService.validate(
      BoardValidation.CREATE,
      request,
    );

    if (updateRequest.title) {
      board.title = updateRequest.title;
    }

    if (updateRequest.description) {
      board.description = updateRequest.description;
    }

    board = await this.prismaService.board.update({
      where: { workspaceId: workspaceId, id: boardId },
      data: board,
    });
    return this.toBoardResponse(board);
  }

  async delete(workspaceId: string, boardId: string): Promise<BoardResponse> {
    const workspace =
      await this.workspaceService.existingWorkspace(workspaceId);
    let board = await this.existingBoard(boardId);

    if (workspace.id !== board.workspaceId) {
      throw new HttpException('Invalid Workspace Id Or Board Id', 401);
    }

    board = await this.prismaService.board.delete({
      where: {
        workspaceId: workspaceId,
        id: boardId,
      },
    });
    return this.toBoardResponse(board);
  }
}
