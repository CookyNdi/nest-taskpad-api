import { Body, Controller, Post } from '@nestjs/common';

import { AccountService } from './account.service';
import { WebResponse } from '../model/web.model';
import {
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
}
