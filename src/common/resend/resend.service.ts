import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

const resendInstance = new Resend(process.env.RESEND_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

@Injectable()
export class ResendService {
  async sendEmailVerification(email: string, token: string) {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`;
    resendInstance.emails.send({
      from: 'mail@webzdev.my.id',
      to: email,
      subject: 'Confirm your email',
      html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
    });
  }

  async sendEmailVerificationToken(email: string, token: string) {
    resendInstance.emails.send({
      from: 'mail@webzdev.my.id',
      to: email,
      subject: 'Confirm your email',
      html: `<p>Your Token : ${token}</p>`,
    });
  }

  async sendAccountPassword(email: string, password: string) {
    resendInstance.emails.send({
      from: 'mail@webzdev.my.id',
      to: email,
      subject: 'Your Account Password',
      html: `<p>Your account password: ${password}, this password is random generate using ...</p>`,
    });
  }
}
