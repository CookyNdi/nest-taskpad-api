import { z, ZodType } from 'zod';

export class WorkspaceValidation {
  static readonly CREATE: ZodType = z.object({
    title: z.string().min(1).max(100),
    description: z.string().min(1).max(100).optional(),
  });
}
