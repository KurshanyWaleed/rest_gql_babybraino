import { ConfigService } from "@nestjs/config";
import { JwtAuthGuard } from "./../../auth/guards/auth.guard";
import { Model } from "mongoose";
import { inscriptionDto, upadatePasswordDto } from "./../models/userDto";
import { UserRepository } from "./../userRepository/user.repository";
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UseGuards,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../models/users.model";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(
    private readonly configservice: ConfigService,
    private readonly userRepo: UserRepository,
    @InjectModel("User") private readonly userModel: Model<User>,
  ) {}
  //! sign Up
  async signUpUserService(userDto: inscriptionDto) {
    // const saltOrRounds = 10;
    console.log(this.configservice.get("SALT_OR_ROUNDS"));
    const hashedpassword = await bcrypt.hash(
      userDto.password,
      parseInt(this.configservice.get<string>("SALT_OR_ROUNDS")),
    );
    console.log(hashedpassword);
    userDto.password = hashedpassword;
    let newUser = new this.userModel(userDto);
    console.log(newUser);
    try {
      await newUser.save();
      return true;
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

  async updatepassService(userid: string, newpassword: upadatePasswordDto) {
    let user = await this.userModel.findById(userid);
    if (user) {
      let passwordaderd = await bcrypt.hash(
        newpassword.password,
        this.configservice.get<number>("SALT_OR_ROUNDS"),
      );
      return await this.userModel.updateOne(
        { _id: userid },
        { password: passwordaderd },
      );
    } else {
      throw new BadRequestException("somthing went wrong ! ");
    }
  }
}
