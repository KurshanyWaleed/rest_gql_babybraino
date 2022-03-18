import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import {
  emailTemplateConfirmAcount,
  emailTemplateConfirmEmail,
} from "src/utils/email";

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendEmail(email: string, token: string) {
    await this.mailerService.sendMail({
      from: "kurshany.waleed@gmail.com",
      to: email,
      subject: "Greeting from BabyBraino | Account Confirmation ",
      html: emailTemplateConfirmAcount(token),
    });
    return { message: "Your account added successfuly ! " };
  }
  //: forgetten password step 2
  async sendEmailForPasswordForgetten(email: string, token: string) {
    console.log(email);
    try {
      await this.mailerService.sendMail({
        from: "kurshany.waleed@gmail.com",
        to: email,
        subject: "Greeting from BabyBraino | Forgetten Password ",

        html: emailTemplateConfirmEmail(token),
      });

      return { message: "Please check your Email box !" };
    } catch (e) {
      return e;
    }
  }
}
