import { HttpException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v7 as uuid } from 'uuid';

import { PrismaService } from '../common/prisma/prisma.service';
import { ValidationService } from '../common/validation/validation.service';
import {
  AccountLoginRequest,
  AccountRegisterRequest,
  AccountResponse,
} from '../model/account.model';
import { AccountValidation } from './account.validation';
import { Account } from '@prisma/client';

type ResponseType = 'required' | 'withToken';

@Injectable()
export class AccountService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  toAccountResponse(account: Account, type?: ResponseType): AccountResponse {
    switch (type) {
      case 'required':
        return {
          name: account.name,
          email: account.email,
        };
      case 'withToken':
        return {
          name: account.name,
          email: account.email,
          token: account.token,
        };
      default:
        return {
          name: account.name,
          email: account.email,
          token: account.token,
          image_url: account.image_url,
          createdAt: account.createdAt,
          updatedAt: account.updatedAt,
        };
    }
  }

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
    return this.toAccountResponse(account, 'required');
  }

  async login(request: AccountLoginRequest): Promise<AccountResponse> {
    console.log(`AccountService.login - request : (${request.email})`);

    const loginRequest: AccountLoginRequest = this.validationService.validate(
      AccountValidation.LOGIN,
      request,
    );

    const existingAccount = await this.prismaService.account.findUnique({
      where: { email: loginRequest.email },
    });

    if (!existingAccount) {
      throw new HttpException('Email or Password invalid!', 401);
    }

    const isValidPassword = await bcrypt.compare(
      loginRequest.password,
      existingAccount.password,
    );

    if (!isValidPassword) {
      throw new HttpException('Email or Password invalid!', 401);
    }

    const account = await this.prismaService.account.update({
      where: { email: loginRequest.email },
      data: { token: uuid() },
    });

    return this.toAccountResponse(account, 'withToken');
  }
}
