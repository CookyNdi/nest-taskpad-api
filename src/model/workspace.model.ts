export class WorkspaceResponse {
  id?: string;
  accountId: string;
  title: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class WorkspaceCreateRequest {
  title: string;
  description?: string;
}
