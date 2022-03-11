import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JwtAuthGuard } from "../auth/guards/auth.guard";
import { Model } from "mongoose";
import {
  ConfirmEmailToUpadatePasswordDto,
  inscriptionDto,
} from "./models/userDto";
import { UserRepository } from "./user.repository";
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UseGuards,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./models/users.model";
import * as bcrypt from "bcrypt";

import { Exception } from "handlebars/runtime";
import { EmailService } from "./user.mail.confi.service";

@Injectable()
export class UsersService {
  constructor(
    private readonly configservice: ConfigService,
    private readonly jwtserv: JwtService,
    private readonly userRepo: UserRepository,
    private readonly emailService: EmailService,

    @InjectModel("User") private readonly userModel: Model<User>,
  ) {}

  async updateUserProfile(userName: string, photoProfile: string) {
    try {
      await this.userModel.findOneAndUpdate({ userName }, { photoProfile });
    } catch (e) {
      throw new Exception(e);
    }
  }
  //! Profile conformation
  async ProfilVerified(token: string) {
    const decoded = await this.jwtserv.verify(token);

    return await this.userModel.updateOne(
      { userName: decoded.username },
      { verified: true },
    );
  }
  //todo update Fields in One Service !
  async updateAttributeService(email: string, attributes: any) {
    if (!(attributes.password == undefined)) {
      try {
        return await this.userModel.findOneAndUpdate(
          { email },
          {
            ...attributes,
            password: await bcrypt.hash(
              attributes.password,
              parseInt(this.configservice.get<string>("SALT_OR_ROUNDS")),
            ),
          },
        );
      } catch (e) {
        throw new ConflictException(
          `${Object.keys(e.keyValue)} is already exist !`,
        );
      }
    } else {
      return await this.userModel.findOneAndUpdate({ email }, attributes);
    }
  }

  //! sign Up
  async signUpUserService(userDto: inscriptionDto) {
    const hashedpassword = await bcrypt.hash(
      userDto.password,
      parseInt(this.configservice.get<string>("SALT_OR_ROUNDS")),
    );

    userDto.password = hashedpassword;
    let newUser = new this.userModel(userDto);

    try {
      await newUser.save();
      const token = this.jwtserv.sign(
        { username: newUser.userName },
        { secret: this.configservice.get("SECRET") },
      );

      return await this.emailService.sendEmail(newUser.email, token);

      // return true;
    } catch (e) {
      console.log(e);
      throw new ConflictException(
        ` this ${Object.keys(e.keyValue)} is already exist ! `,
      );
    }
  }
  //!  One User list
  @UseGuards(JwtAuthGuard)
  async getUserService(id: string) {
    return await this.userModel.findOne({ _id: id });
  }
  //! List of Users
  @UseGuards(JwtAuthGuard)
  async getUsersService() {
    return await this.userModel.find();
  }
  //!  by Location
  async getUserByLocationService(location: string) {
    return this.userRepo.findUserByLocation(location);
  }
  //!  by userName
  async getUserByUserNameService(userName: string) {
    return this.userRepo.findUserByUsername(userName);
  }
  // !!!!!!
  async forgettenPasswordService(
    token: any,
    inputEmail: ConfirmEmailToUpadatePasswordDto,
  ) {
    const decoded = await this.jwtserv.verify(token);
    console.log(decoded.sub);

    let user = await this.userModel.findOne({ _id: decoded.sub });
    if (user.email == inputEmail.email) {
      return await this.emailService.sendEmailForPasswordForgetten(
        user.email,
        token,
      );
    } else {
      throw new NotFoundException(`this ${inputEmail.email} is not exist ! `);
    }
  }
}
