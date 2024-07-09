export class BoardResponse {
  id: string;
  workspaceId: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export class BoardCreateRequest {
  title: string;
  description?: string;
}

export class BoardUpdateRequest {
  title: string;
  description?: string;
}
