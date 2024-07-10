import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

const resendInstance = new Resend(process.env.RESEND_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

@Injectable()
export class ResendService {
  async sendMail(email: string, token: string) {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`;
    resendInstance.emails.send({
      from: 'mail@webzdev.my.id',
      to: email,
      subject: 'Confirm your email',
      html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
    });
  }
}
