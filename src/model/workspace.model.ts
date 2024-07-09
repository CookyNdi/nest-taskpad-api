import { BoardResponse } from './board.model';

export class WorkspaceResponse {
  id?: string;
  title: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  Board?: BoardResponse[];
}

export class WorkspaceCreateRequest {
  title: string;
  description?: string;
}

export class WorkspaceUpdateRequest {
  title: string;
  description?: string;
}
