import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Account, Workspace } from '@prisma/client';

import { WorkspaceService } from './workspace.service';
import { WebResponse } from '../model/web.model';
import {
  WorkspaceCreateRequest,
  WorkspaceResponse,
} from '../model/workspace.model';
import { Auth } from '../common/auth/auth.decorator';
import { WorkspaceData } from '../common/workspace/workspace.decorator';

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
    @WorkspaceData() workspace: Workspace,
  ): Promise<WebResponse<WorkspaceResponse>> {
    const result = await this.workspaceService.update(
      account,
      request,
      workspace,
    );
    return {
      data: result,
      message: 'Workspace has been updated!',
    };
  }

  @Get('/:workspaceId')
  @HttpCode(200)
  async getById(
    @Auth() account: Account,
    @Param('workspaceId') workspaceId: string,
  ): Promise<WebResponse<WorkspaceResponse>> {
    const result = await this.workspaceService.getById(account, workspaceId);
    return {
      data: result,
    };
  }

  @Get()
  @HttpCode(200)
  async getAll(
    @Auth() account: Account,
  ): Promise<WebResponse<WorkspaceResponse[]>> {
    const result = await this.workspaceService.getAll(account);
    if (result.length < 1) {
      return {
        data: result,
        message: 'Wokrspace not found, please make at least one workspace',
      };
    }
    return {
      data: result,
    };
  }

  @Delete('/:workspaceId')
  @HttpCode(200)
  async delete(
    @Auth() account: Account,
    @WorkspaceData() workspace: Workspace,
  ): Promise<WebResponse<WorkspaceResponse>> {
    const result = await this.workspaceService.delete(account, workspace);
    return {
      data: result,
      message: 'Workspace has been deleted!',
    };
  }
}
