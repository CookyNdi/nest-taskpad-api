import { Injectable } from '@nestjs/common';

import { PrismaService } from '../common/prisma/prisma.service';
import { ValidationService } from '../common/validation/validation.service';
import {
  TaskCreateRequest,
  TaskResponse,
  TaskUpdateRequest,
} from '../model/task.model';
import { TaskValidation } from './task.validation';
import { Tasks } from '@prisma/client';

@Injectable()
export class TaskService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async create(
    request: TaskCreateRequest,
    boardId: string,
  ): Promise<TaskResponse> {
    console.log(
      `TaskService.create - request : (${request.title}, ${request.status}) - boardId : (${boardId})`,
    );

    const createRequest: TaskCreateRequest = this.validationService.validate(
      TaskValidation.CREATE,
      request,
    );

    const task = await this.prismaService.tasks.create({
      data: {
        boardId: boardId,
        ...createRequest,
      },
    });

    return task;
  }

  async update(request: TaskUpdateRequest, task: Tasks): Promise<TaskResponse> {
    console.log(
      `TaskService.update - request : (${request.title}, ${request.status}) - taskId : (${task.id})`,
    );

    const updateRequest: TaskUpdateRequest = this.validationService.validate(
      TaskValidation.CREATE,
      request,
    );

    if (updateRequest.title) {
      task.title = updateRequest.title;
    }
    if (updateRequest.status) {
      task.status = updateRequest.status;
    }

    task = await this.prismaService.tasks.update({
      where: { id: task.id },
      data: task,
    });
    return task;
  }

  async getById(task: Tasks): Promise<TaskResponse> {
    console.log(`TaskService.getById - task : (${task.title}, ${task.status})`);
    return task;
  }

  async delete(task: Tasks): Promise<TaskResponse> {
    console.log(`TaskService.delete - task : (${task.title}, ${task.status})`);

    task = await this.prismaService.tasks.delete({
      where: { id: task.id },
    });

    return task;
  }
}
