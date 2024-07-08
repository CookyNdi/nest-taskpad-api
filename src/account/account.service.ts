import { HttpException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../common/prisma/prisma.service';
import { ValidationService } from '../common/validation/validation.service';
import {
  AccountRegisterRequest,
  AccountResponse,
} from '../model/account.model';
import { AccountValidation } from './account.validation';

@Injectable()
export class AccountService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async register(request: AccountRegisterRequest): Promise<AccountResponse> {
    console.log(
      `AccountService.register - request : (${request.name}, ${request.email})`,
    );

    const registerRequest: AccountRegisterRequest =
      this.validationService.validate(AccountValidation.REGISTER, request);

    const existingAccount = await this.prismaService.account.findUnique({
      where: { email: registerRequest.email },
    });

    if (existingAccount) {
      throw new HttpException('Email Already Registered!', 400);
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const account = await this.prismaService.account.create({
      data: registerRequest,
    });
    return {
      name: account.name,
      email: account.email,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    };
  }
}
