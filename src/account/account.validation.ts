import { z, ZodType } from 'zod';

export class AccountValidation {
  static readonly REGISTER: ZodType = z.object({
    name: z.string().min(1).max(100),
    email: z.string().min(1).max(100).email(),
    password: z.string().min(1).max(20),
    image_url: z.string().min(1).max(256).optional(),
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
  static readonly UPDATE_PASSWORD: ZodType = z.object({
    password: z.string().min(1).max(20),
    old_password: z.string().min(1).max(20),
  });
  static readonly UPDATE_EMAIL: ZodType = z.object({
    password: z.string().min(1).max(20),
    email: z.string().min(1).max(100).email(),
    old_email: z.string().min(1).max(100).email(),
  });
  static readonly UPDATE_NAME: ZodType = z.object({
    name: z.string().min(1).max(100),
  });
  static readonly EMAIL_VERIFICATION: ZodType = z.object({
    token: z.string().min(1).max(100),
  });
}
