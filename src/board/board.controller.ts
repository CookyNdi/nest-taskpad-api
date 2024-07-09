import { Body, Controller, Param, Patch, Post } from '@nestjs/common';

import { BoardService } from './board.service';
import { WebResponse } from '../model/web.model';
import { BoardCreateRequest, BoardResponse } from '../model/board.model';

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
  async update(
    @Param('workspaceId') workspaceId: string,
    @Param('boardId') boardId: string,
    @Body() request: BoardCreateRequest,
  ): Promise<WebResponse<BoardResponse>> {
    const result = await this.boardService.update(
      workspaceId,
      request,
      boardId,
    );
    return {
      data: result,
      message: 'Board has been updated!',
    };
  }
}
