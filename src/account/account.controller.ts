import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { AccountService } from './account.service';
import { WebResponse } from '../model/web.model';
import {
  AccountEmailVerificationRequest,
  AccountLoginRequest,
  AccountRegisterRequest,
  AccountResponse,
  AccountUpdateAvatarRequest,
  AccountUpdateEmail,
  AccountUpdateName,
  AccountUpdatePassword,
  sendEmailVerificationTokenRequest,
} from '../model/account.model';
import { Auth } from '../common/auth/auth.decorator';
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

  @Post('/verification-email')
  @HttpCode(200)
  async emailVerification(
    @Body() request: AccountEmailVerificationRequest,
  ): Promise<WebResponse<AccountResponse>> {
    const result = await this.accountService.emailVerification(request);

    return {
      data: result,
      message: 'Email verified!',
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

  @Get('/email')
  async getAccountByEmail(
    @Query('email') email: string,
  ): Promise<WebResponse<AccountResponse>> {
    const result = await this.accountService.getAccountByEmail(email);
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

  @Patch('/change-password')
  @HttpCode(200)
  async updatePassword(
    @Auth() account: Account,
    @Body() request: AccountUpdatePassword,
  ): Promise<WebResponse<AccountResponse>> {
    const result = await this.accountService.updatePassword(account, request);
    return {
      data: result,
      message: 'Your Password has been updated',
    };
  }

  @Patch('/change-email')
  @HttpCode(200)
  async updateEmail(
    @Auth() account: Account,
    @Body() request: AccountUpdateEmail,
  ): Promise<WebResponse<AccountResponse>> {
    const result = await this.accountService.updateEmail(account, request);
    return {
      data: result,
      message: 'Your Email has been updated',
    };
  }

  @Post('/send-verification-token')
  @HttpCode(200)
  async sendVerificationToken(
    @Body() request: sendEmailVerificationTokenRequest,
  ): Promise<WebResponse<AccountResponse>> {
    await this.accountService.sendEmailVerificationToken(request);
    return {
      message: 'Your Verfication Token Has Been Send To Your Account!',
    };
  }

  @Patch('/change-name')
  @HttpCode(200)
  async updateName(
    @Auth() account: Account,
    @Body() request: AccountUpdateName,
  ): Promise<WebResponse<AccountResponse>> {
    const result = await this.accountService.updateName(account, request);
    return {
      data: result,
      message: 'Your Name has been updated',
    };
  }

  @Delete('/current')
  async logout(
    @Auth() account: Account,
  ): Promise<WebResponse<AccountResponse>> {
    await this.accountService.logout(account);
    return {
      message: 'You have ben logouted',
    };
  }
}
