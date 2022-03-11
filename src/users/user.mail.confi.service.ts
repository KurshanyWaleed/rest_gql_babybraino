import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import e from "express";

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendEmail(email: string, token: string) {
    console.log(email);
    console.log(
      await this.mailerService.sendMail({
        from: "kurshany.waleed@gmail.com",
        to: email,
        subject: "Greeting from NestJS NodeMailer",
        html: `<b></b>
        <a href=${`http://localhost:3000/users/confirm/${token}`}/>${token}</a>`,
      }),
    );
    return await this.mailerService.sendMail({
      from: "kurshany.waleed@gmail.com",
      to: email,
      subject: "Greeting from NestJS NodeMailer",
      html: `<b></b>
        <a href=${`http://localhost:3000/api/users/confirm/${token}`}/>${token}</a>`,
    });
  }

  async sendEmailForPasswordForgetten(email: string, token: string) {
    console.log(email);
    this.mailerService
      .sendMail({
        from: "kurshany.waleed@gmail.com",
        to: email,
        subject: "Forgetten Password ",
        html: `<b></b>
        <a href=${`http://localhost:3000/api/users/${email}/updating`}>${token}</a>`,
      })
      .then((e) => console.log(e));
  }
}
