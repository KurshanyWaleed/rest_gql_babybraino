import { InjectModel } from "@nestjs/mongoose";
import { inscriptionDto, upadatePasswordDto } from "./../models/userDto";
import { UsersService } from "./../userServices/users.service";

import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { BabyGenderPipe, StatusPipe } from "src/pipes/customPipes";
import { JwtAuthGuard } from "src/auth/guards/auth.guard";
import { User } from "../models/users.model";
import { Model } from "mongoose";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";

@Controller("users")
export class UsersController {
  constructor(
    private readonly userServ: UsersService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  @Post("upload")
  @UseInterceptors(FilesInterceptor("photoProfile"))
  uploadFile(@UploadedFiles() file: Express.Multer.File) {
    const { fieldname, originalname } = file[0];
    const response = { fieldname, originalname };
    console.log(response);
    return response;
  }

  @Post("signUp")
  @UsePipes(ValidationPipe)
  @UsePipes(new StatusPipe(), new BabyGenderPipe())
  async signUp(@Body() userDto: inscriptionDto) {
    return await this.userServ.signUpUserService(userDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers(@Query("location") location: string) {
    if (location) {
      return await this.userServ.getUserByLocationService(location);
    } else {
      return await this.userServ.getUsersService();
    }
  }
  @UsePipes(ValidationPipe)
  @Put(":id/updating")
  async updatePassword(
    @Param("id")
    userId: string,
    @Body() password: upadatePasswordDto,
  ) {
    let updated = await this.userServ.updatepassService(userId, password);
    if (updated) {
      return {
        statusCode: HttpStatus.ACCEPTED,
        messages: ["Password has been succesfully !"],
      };
    } else {
      new BadRequestException();
    }
  }
  @Get("confirm/:token")
  async confirmation(@Param("token") token: string) {
    try {
      const hasBeenVerified = await this.userServ.ProfilVerified(token);
      return hasBeenVerified;
    } catch (e) {
      throw new BadRequestException(e);
    }
    // ? { acount_verified: hasBeenVerified } : null;
  }

  @Get(":id")
  async getUserById(@Param("id") id: string) {
    return await this.userModel.findById({ _id: id });
  }
}
