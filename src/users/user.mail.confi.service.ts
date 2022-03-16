import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { emailTemplate } from "src/utils/email";

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendEmail(email: string, token: string) {
    await this.mailerService.sendMail({
      from: "kurshany.waleed@gmail.com",
      to: email,
      subject: "Greeting from BabyBrains ",
      html: `<b></b>
      Please click this link below to COnfirm your account :D
        <a href=${`http://localhost:3000/api/users/confirm/${token}`}/>${token}</a>`,
    });
    return { message: "Your account added successfuly ! " };
  }
  //: forgetten password step 2
  async sendEmailForPasswordForgetten(email: string, token: string) {
    console.log(email);
    try {
      const mailSent = await this.mailerService.sendMail({
        from: "kurshany.waleed@gmail.com",
        to: email,
        subject: "Forgetten Password ",
        html: emailTemplate(token),
      });

      return { message: "Please check your Email box !  ^^ " };
    } catch (e) {
      return e;
    }
  }
}
