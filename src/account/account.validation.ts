import { z, ZodType } from 'zod';

export class AccountValidation {
  static readonly REGISTER: ZodType = z.object({
    name: z.string().min(1).max(100),
    email: z.string().min(1).max(100).email(),
    password: z.string().min(1).max(20),
  });
}
