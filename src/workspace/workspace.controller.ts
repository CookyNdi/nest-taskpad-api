import { Body, Controller, HttpCode, Param, Patch, Post } from '@nestjs/common';

import { WorkspaceService } from './workspace.service';
import { WebResponse } from '../model/web.model';
import {
  WorkspaceCreateRequest,
  WorkspaceResponse,
} from '../model/workspace.model';
import { Auth } from 'src/common/auth/auth.decorator';
import { Account } from '@prisma/client';

@Controller('/api/workspace')
export class WorkspaceController {
  constructor(private workspaceService: WorkspaceService) {}

  @Post()
  async create(
    @Auth() account: Account,
    @Body() request: WorkspaceCreateRequest,
  ): Promise<WebResponse<WorkspaceResponse>> {
    const result = await this.workspaceService.create(account, request);
    return {
      data: result,
      message: 'Workspace created successfully!',
    };
  }

  @Patch('/:workspaceId')
  @HttpCode(200)
  async update(
    @Auth() account: Account,
    @Body() request: WorkspaceCreateRequest,
    @Param('workspaceId') workspaceId: string,
  ): Promise<WebResponse<WorkspaceResponse>> {
    const result = await this.workspaceService.update(
      account,
      request,
      workspaceId,
    );
    return {
      data: result,
      message: 'Workspace has been updated!',
    };
  }
}
