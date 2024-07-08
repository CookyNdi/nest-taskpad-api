import { Injectable, NestMiddleware } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private prismaService: PrismaService) {}
  async use(req: any, res: any, next: () => void) {
    const token = req.headers['authorization'] as string;
    if (token) {
      const account = await this.prismaService.account.findFirst({
        where: { token: token },
      });
      if (account) {
        req.account = account;
      }
    }
    next();
  }
}
