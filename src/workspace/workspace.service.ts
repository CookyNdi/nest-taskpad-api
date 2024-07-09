import { HttpException, Injectable } from '@nestjs/common';
import { Account, Workspace } from '@prisma/client';

import { PrismaService } from '../common/prisma/prisma.service';
import { ValidationService } from '../common/validation/validation.service';
import {
  WorkspaceCreateRequest,
  WorkspaceResponse,
  WorkspaceUpdateRequest,
} from '../model/workspace.model';
import { WorkspaceValidation } from './workspace.validation';

@Injectable()
export class WorkspaceService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  toWorkspaceResponse(workspace: Workspace): WorkspaceResponse {
    return {
      id: workspace.id,
      accountId: workspace.accountId,
      title: workspace.title,
      description: workspace.description,
      createdAt: workspace.createdAt,
      updatedAt: workspace.createdAt,
    };
  }

  async existingWorkspace(workspaceId: string): Promise<Workspace> {
    const workspace = await this.prismaService.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace) {
      throw new HttpException('Workspace not found!', 404);
    }
    return workspace;
  }

  async create(
    account: Account,
    request: WorkspaceCreateRequest,
  ): Promise<WorkspaceResponse> {
    console.log(
      `WorkspaceService.create - request : (${request.title}, ${request.description})`,
    );

    const createRequest: WorkspaceCreateRequest =
      this.validationService.validate(WorkspaceValidation.CREATE, request);

    const workspace = await this.prismaService.workspace.create({
      data: {
        accountId: account.id,
        ...createRequest,
      },
    });

    return this.toWorkspaceResponse(workspace);
  }

  async update(
    account: Account,
    request: WorkspaceUpdateRequest,
    workspaceId: string,
  ): Promise<WorkspaceResponse> {
    console.log(
      `WorkspaceService.update - request : (${request.title}, ${request.description})`,
    );
    let workspace = await this.existingWorkspace(workspaceId);

    if (account.id !== workspace.accountId) {
      throw new HttpException('Unauthorized!', 401);
    }

    const updateRequest: WorkspaceUpdateRequest =
      this.validationService.validate(WorkspaceValidation.UPDATE, request);

    if (updateRequest.title) {
      workspace.title = updateRequest.title;
    }
    if (updateRequest.description) {
      workspace.description = updateRequest.description;
    }

    workspace = await this.prismaService.workspace.update({
      where: {
        accountId: account.id,
        id: workspaceId,
      },
      data: workspace,
    });
    return this.toWorkspaceResponse(workspace);
  }

  async getById(
    account: Account,
    workspaceId: string,
  ): Promise<WorkspaceResponse> {
    const workspace = await this.existingWorkspace(workspaceId);
    if (account.id !== workspace.accountId) {
      throw new HttpException('Unauthorized!', 401);
    }

    return this.toWorkspaceResponse(workspace);
  }
}
