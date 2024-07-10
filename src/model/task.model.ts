export class TaskResponse {
  id: string;
  boardId: string;
  title: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export class TaskCreateRequest {
  title: string;
  status: string;
}

export class TaskUpdateRequest {
  title: string;
  status: string;
}
