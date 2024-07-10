import { z, ZodType } from 'zod';

export class TaskValidation {
  static readonly CREATE: ZodType = z.object({
    title: z.string().min(1).max(100),
    status: z.string().min(1).max(20),
  });
  static readonly UPDATE: ZodType = z.object({
    title: z.string().min(1).max(100),
    status: z.string().min(1).max(20),
  });
}
