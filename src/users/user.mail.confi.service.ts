import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendEmail(email: string, token: string) {
    console.log(email);
    await this.mailerService.sendMail({
      from: "kurshany.waleed@gmail.com",
      to: email,
      subject: "Greeting from NestJS NodeMailer",
      html: `<b></b>
        <a href=${`http://localhost:3000/users/confirm/${token}`}/>${token}</a>`,
    });
  }
}
