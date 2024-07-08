import { Body, Controller, HttpCode, Post } from '@nestjs/common';

import { AccountService } from './account.service';
import { WebResponse } from '../model/web.model';
import {
  AccountLoginRequest,
  AccountRegisterRequest,
  AccountResponse,
} from '../model/account.model';

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
}
