import { Body, Controller, Param, Post } from '@nestjs/common';

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
}
