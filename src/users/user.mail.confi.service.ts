import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendEmail(email: string, token: string) {
    await this.mailerService.sendMail({
      from: "kurshany.waleed@gmail.com",
      to: email,
      subject: "Greeting from NestJS NodeMailer",
      html: `<b></b>
        <a href=${`http://localhost:3000/api/users/confirm/${token}`}/>${token}</a>`,
    });
    return { message: "account added successfuly ! " };
  }
  //: forgetten password step 2
  async sendEmailForPasswordForgetten(email: string, token: string) {
    console.log(email);
    try {
      const mailSent = await this.mailerService.sendMail({
        from: "kurshany.waleed@gmail.com",
        to: email,
        subject: "Forgetten Password ",
        html: ` please click this link below to get the permession to change your password
         <a href="http://localhost:3000/api/users/${token}/updating-Password" />${token}</a>`,
      });

      return { message: "Please check your Email box ! " };
    } catch (e) {
      return e;
    }
  }
}
