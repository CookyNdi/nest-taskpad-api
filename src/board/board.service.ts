import { Injectable } from '@nestjs/common';
import { Account, Board } from '@prisma/client';

import { PrismaService } from '../common/prisma/prisma.service';
import { ValidationService } from '../common/validation/validation.service';
import {
  BoardCreateRequest,
  BoardResponse,
  BoardUpdateRequest,
} from '../model/board.model';
import { BoardValidation } from './board.validation';

@Injectable()
export class BoardService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
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

  async create(
    workspaceId: string,
    request: BoardCreateRequest,
  ): Promise<BoardResponse> {
    console.log(
      `BoardService.create - request : (${request.title}, ${request.description}) - workspaceId : (${workspaceId})`,
    );

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
    account: Account,
    workspaceId: string,
    request: BoardUpdateRequest,
    board: Board,
  ): Promise<BoardResponse> {
    console.log(
      `BoardService.update - request : (${request.title}, ${request.description}) - workspaceId : (${workspaceId}) - board : (${board.title}) - account : (${account.name}, ${account.email})`,
    );

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
      where: { workspaceId: workspaceId, id: board.id },
      data: board,
    });
    return this.toBoardResponse(board);
  }

  async delete(
    account: Account,
    workspaceId: string,
    board: Board,
  ): Promise<BoardResponse> {
    console.log(
      `BoardService.delete - workspaceId : (${workspaceId}) - board : (${board.title})  - account : (${account.name}, ${account.email})`,
    );

    board = await this.prismaService.board.delete({
      where: {
        workspaceId: workspaceId,
        id: board.id,
      },
    });
    return this.toBoardResponse(board);
  }
}
