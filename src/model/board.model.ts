import { TaskResponse } from './task.model';

export class BoardResponse {
  id: string;
  workspaceId: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  Tasks?: TaskResponse[];
}

export class BoardCreateRequest {
  title: string;
  description?: string;
}

export class BoardUpdateRequest {
  title: string;
  description?: string;
}
