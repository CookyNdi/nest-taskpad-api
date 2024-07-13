import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../src/common/prisma/prisma.service';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  async deleteAccount() {
    await this.prismaService.account.deleteMany({
      where: {
        email: 'test@example.com',
      },
    });
  }

  async createAccount() {
    await this.prismaService.account.create({
      data: {
        name: 'test',
        email: 'test@example.com',
        password: await bcrypt.hash('test123', 10),
        token: 'test',
      },
    });
  }

  async updateEmailVerified() {
    await this.prismaService.account.update({
      where: { email: 'test@example.com' },
      data: { emailVerified: true },
    });
  }
}
