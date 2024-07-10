import { Tasks } from '@prisma/client';
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

import { TaskService } from './task.service';
import { WebResponse } from '../model/web.model';
import { TaskCreateRequest, TaskResponse } from '../model/task.model';
import { TaskData } from '../common/task/task.decorator';

@Controller('/api/workspace/:workspaceId/board/:boardId/task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  async create(
    @Body() request: TaskCreateRequest,
    @Param('boardId') boardId: string,
  ): Promise<WebResponse<TaskResponse>> {
    const result = await this.taskService.create(request, boardId);
    return {
      data: result,
      message: 'Task created successfully!',
    };
  }

  @Patch('/:taskId')
  @HttpCode(200)
  async update(
    @Body() request: TaskCreateRequest,
    @TaskData() task: Tasks,
  ): Promise<WebResponse<TaskResponse>> {
    const result = await this.taskService.update(request, task);
    return {
      data: result,
      message: 'Task has been updated',
    };
  }

  @Get('/:taskId')
  @HttpCode(200)
  async getById(@TaskData() task: Tasks): Promise<WebResponse<TaskResponse>> {
    const result = await this.taskService.getById(task);
    return {
      data: result,
    };
  }

  @Delete('/:taskId')
  @HttpCode(200)
  async delete(@TaskData() task: Tasks): Promise<WebResponse<TaskResponse>> {
    const result = await this.taskService.delete(task);
    return {
      data: result,
      message: 'Task has been deleted!',
    };
  }
}
