import { z, ZodType } from 'zod';

export class AccountValidation {
  static readonly REGISTER: ZodType = z.object({
    name: z.string().min(1).max(100),
    email: z.string().min(1).max(100).email(),
    password: z.string().min(1).max(20),
  });
  static readonly LOGIN: ZodType = z.object({
    email: z.string().min(1).max(100).email(),
    password: z.string().min(1).max(20),
  });
  static readonly AVATAR: ZodType = z.object({
    image_url: z
      .string()
      .min(1)
      .max(256)
      .regex(/^https:\/\/utfs\.io\/.*$/, { message: 'Invalid image url' }),
  });
}
