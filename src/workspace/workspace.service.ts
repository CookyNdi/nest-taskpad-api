import { HttpException, Injectable } from '@nestjs/common';
import { Account, Board, Tasks, Workspace } from '@prisma/client';

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

  toWorkspaceResponse(
    workspace: Workspace & { Board?: (Board & { Tasks: Tasks[] })[] },
    isIncludesBoard?: boolean,
  ): WorkspaceResponse {
    if (!isIncludesBoard) {
      return {
        id: workspace.id,
        title: workspace.title,
        description: workspace.description,
        createdAt: workspace.createdAt,
        updatedAt: workspace.createdAt,
      };
    } else {
      return {
        id: workspace.id,
        title: workspace.title,
        description: workspace.description,
        createdAt: workspace.createdAt,
        updatedAt: workspace.createdAt,
        Board: workspace.Board,
      };
    }
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
      `WorkspaceService.create - request : (${request.title}, ${request.description}) - account : (${account.name}, ${account.email})`,
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
    workspace: Workspace,
  ): Promise<WorkspaceResponse> {
    console.log(
      `WorkspaceService.update - request : (${request.title}, ${request.description})  - account : (${account.name}, ${account.email}) - workspace : (${workspace.title})`,
    );

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
        id: workspace.id,
      },
      data: workspace,
    });
    return this.toWorkspaceResponse(workspace);
  }

  async getById(
    account: Account,
    workspaceId: string,
  ): Promise<WorkspaceResponse> {
    console.log(
      `WorkspaceService.getById - account : (${account.name}, ${account.email}) - workspaceid : (${workspaceId})`,
    );
    const workspace = await this.prismaService.workspace.findUnique({
      where: { id: workspaceId, accountId: account.id },
      include: {
        Board: {
          select: {
            id: true,
            workspaceId: true,
            title: true,
            description: true,
            createdAt: true,
            updatedAt: true,
            Tasks: true,
          },
        },
      },
    });

    return this.toWorkspaceResponse(workspace, true);
  }

  async getAll(account: Account): Promise<WorkspaceResponse[]> {
    console.log(
      `WorkspaceService.getAll - account : (${account.name}, ${account.email})`,
    );
    const workspaces = await this.prismaService.workspace.findMany({
      where: { accountId: account.id },
    });

    return workspaces.map((workspace) => this.toWorkspaceResponse(workspace));
  }

  async delete(
    account: Account,
    workspace: Workspace,
  ): Promise<WorkspaceResponse> {
    console.log(
      `WorkspaceService.delete - account : (${account.name}, ${account.email}) - workspace : (${workspace.title})`,
    );

    workspace = await this.prismaService.workspace.delete({
      where: {
        accountId: account.id,
        id: workspace.id,
      },
    });

    return this.toWorkspaceResponse(workspace);
  }
}
