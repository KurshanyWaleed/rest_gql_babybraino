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
  Inject,
  Injectable,
  NotFoundException,
  UseGuards,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./models/users.model";
import * as bcrypt from "bcrypt";

import { Exception } from "handlebars/runtime";
import { EmailService } from "./user.mail.confi.service";
import { ClientProxy } from "@nestjs/microservices";
import { NEW_INSCRIPTION, USER_HAS_BEEN_DELETED } from "src/utils/constantes";

@Injectable()
export class UsersService {
  constructor(
    private readonly configservice: ConfigService,
    private readonly jwtserv: JwtService,
    private readonly userRepo: UserRepository,
    private readonly emailService: EmailService,
    @Inject("USER_SERVICES") private readonly fromClient: ClientProxy,
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
  async updateAttributeService(token: string, attributes: any) {
    try {
      await this.jwtserv.verify(token);
      const { sub } = this.jwtserv.decode(token);

      console.log(sub);
      if (!(attributes.password == undefined)) {
        try {
          const user = await this.userModel.findById({ _id: sub });
          if (user.ableToChangePassword == true) {
            return await this.userModel.findOneAndUpdate(
              { _id: sub },
              {
                ...attributes,
                password: await bcrypt.hash(
                  attributes.password,
                  parseInt(this.configservice.get<string>("SALT_OR_ROUNDS")),
                ),
              },
            );
          } else {
            return {
              message:
                "You dont have the permission yet, please check your email box ! ",
            };
          }
        } catch (e) {
          throw new ConflictException(
            `${Object.keys(e.keyValue)} is already exist !`,
          );
        }
      } else {
        return await this.userModel.findOneAndUpdate({ _id: sub }, attributes);
      }
    } catch (e) {
      throw new Exception(e);
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

      //  return await this.emailService.sendEmail(newUser.email, token);
      this.fromClient.emit(NEW_INSCRIPTION, newUser);
    } catch (e) {
      console.log(e);
      throw new ConflictException(
        ` This ${Object.keys(e.keyValue)} is already exist ! `,
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
  //: forgetten password step 1
  async changePassService(inputEmail: ConfirmEmailToUpadatePasswordDto) {
    const user = await this.userModel.findOne({ email: inputEmail.email });
    if (user) {
      const token = this.jwtserv.sign(
        { username: user.userName, sub: user._id },
        { secret: this.configservice.get("SECRET") },
      );
      await this.emailService.sendEmailForPasswordForgetten(
        inputEmail.email,
        token,
      );
      return { token: token };
    } else {
      throw new NotFoundException(
        `This Email ${inputEmail.email} does not exist ! `,
      );
    }
  }
  async removeUser(_id: string) {
    try {
      const user = await this.userModel.findById({ _id });
      if (user) {
        await this.userModel.deleteOne({ _id });
        this.fromClient.emit(USER_HAS_BEEN_DELETED, {
          messege: "the user has been deleted",
        });
        return { message: `Account has been deleted!` };
      } else {
        console.log();
        return { message: `This id ${_id} does not exist ! ` };
      }
    } catch (e) {
      return new Error(e);
    }
  }
}
