import { Injectable } from '@nestjs/common';
import { Account, Workspace } from '@prisma/client';

import { PrismaService } from '../common/prisma/prisma.service';
import { ValidationService } from '../common/validation/validation.service';
import {
  WorkspaceCreateRequest,
  WorkspaceResponse,
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
}
