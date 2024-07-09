import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Account } from '@prisma/client';

import { BoardService } from './board.service';
import { WebResponse } from '../model/web.model';
import { BoardCreateRequest, BoardResponse } from '../model/board.model';
import { Auth } from '../common/auth/auth.decorator';

@Controller('/api/workspace/:workspaceId/board')
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Post()
  async create(
    @Param('workspaceId') workspaceId: string,
    @Body() request: BoardCreateRequest,
  ): Promise<WebResponse<BoardResponse>> {
    const result = await this.boardService.create(workspaceId, request);
    return {
      data: result,
      message: 'Board created successfully!',
    };
  }

  @Patch('/:boardId')
  @HttpCode(200)
  async update(
    @Auth() account: Account,
    @Param('workspaceId') workspaceId: string,
    @Param('boardId') boardId: string,
    @Body() request: BoardCreateRequest,
  ): Promise<WebResponse<BoardResponse>> {
    const result = await this.boardService.update(
      account,
      workspaceId,
      request,
      boardId,
    );
    return {
      data: result,
      message: 'Board has been updated!',
    };
  }

  @Delete('/:boardId')
  @HttpCode(200)
  async delete(
    @Auth() account: Account,
    @Param('workspaceId') workspaceId: string,
    @Param('boardId') boardId: string,
  ): Promise<WebResponse<BoardResponse>> {
    const result = await this.boardService.delete(
      account,
      workspaceId,
      boardId,
    );
    return {
      data: result,
      message: 'Board has been deleted!',
    };
  }
}
