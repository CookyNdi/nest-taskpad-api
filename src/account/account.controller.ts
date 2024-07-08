import { Body, Controller, Get, HttpCode, Patch, Post } from '@nestjs/common';

import { AccountService } from './account.service';
import { WebResponse } from '../model/web.model';
import {
  AccountLoginRequest,
  AccountRegisterRequest,
  AccountResponse,
  AccountUpdateAvatarRequest,
} from '../model/account.model';
import { Auth } from 'src/common/auth/auth.decorator';
import { Account } from '@prisma/client';

@Controller('/api/account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Post()
  async register(
    @Body() request: AccountRegisterRequest,
  ): Promise<WebResponse<AccountResponse>> {
    const result = await this.accountService.register(request);
    return {
      data: result,
      message: 'Account Created Succcessfully!',
    };
  }

  @Post('/login')
  @HttpCode(200)
  async login(
    @Body() request: AccountLoginRequest,
  ): Promise<WebResponse<AccountResponse>> {
    const result = await this.accountService.login(request);

    return {
      data: result,
      message: 'Login Successfully',
    };
  }

  @Get('/current')
  async getCurrentLogin(
    @Auth() account: Account,
  ): Promise<WebResponse<AccountResponse>> {
    const result = await this.accountService.getCurrentLogin(account);
    return {
      data: result,
    };
  }

  @Patch('/avatar')
  @HttpCode(200)
  async updateAvatar(
    @Auth() account: Account,
    @Body() request: AccountUpdateAvatarRequest,
  ): Promise<WebResponse<AccountResponse>> {
    const result = await this.accountService.updateAvatar(account, request);
    return {
      data: result,
      message: 'Your Avatar has been updated',
    };
  }
}
