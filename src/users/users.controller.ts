import { Analyse } from "./token_analyse";

import { intFileName } from "../utils/filename_inter";
import { InjectModel } from "@nestjs/mongoose";
import {
  ConfirmEmailToUpadatePasswordDto,
  inscriptionDto,
} from "./models/userDto";

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";

import { Request } from "express";
import { BabyGenderPipe, StatusPipe } from "src/pipes/customPipes";
import { JwtAuthGuard } from "src/auth/guards/auth.guard";
import { User } from "./models/users.model";
import { Model } from "mongoose";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { UsersService } from "./users.service";
import { Exception } from "handlebars/runtime";

@Controller("users")
export class UsersController {
  constructor(
    private readonly userServ: UsersService,
    private readonly tikenAnlyse: Analyse,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  @Post("upload")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor("photoProfile", {
      storage: diskStorage({
        destination: "./uploads",
        filename: intFileName,
      }),
    }),
  )
  async uploadFile(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    return await this.userServ.updateUserProfile(
      req.body.userName,
      file.filename,
    );
  }

  @Post("signUp")
  @UsePipes(ValidationPipe)
  @UsePipes(new StatusPipe(), new BabyGenderPipe())
  async signUp(@Body() userDto: inscriptionDto) {
    return await this.userServ.signUpUserService(userDto);
  }

  @Delete("this/:id/deleting")
  async removeUser(@Param("id") _id: string) {
    return { result: await this.userServ.removeUser(_id) };
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
  //!forgetten password 1

  @Post("/forgetPassword")
  @UsePipes(ValidationPipe)
  async updatePasswordByEmail(
    @Body() inputEmail: ConfirmEmailToUpadatePasswordDto,
  ) {
    return await this.userServ.changePassService(inputEmail);
  }

  ///! forgetten password step 4
  @Put(":token/New-Password")
  async updatePasswordAfterForgetten(
    @Param("token") token: string,
    @Body() attributes: any,
  ) {
    try {
      this.tikenAnlyse.isValidToken(token);
      const result = await this.userServ.updateAttributeService(
        token,
        attributes,
      );
      if (result) {
        return { result };
      }
    } catch (e) {
      return new Exception(e);
      //return new Exception("something went wrong maybe the token is not valid");
    }
  }

  ///! forgetten password step 3
  @Get(":token/updating-Password-permission")
  upadatePass(@Param("token") token: string) {
    this.userServ.updateAttributeService(token, {
      ableToChangePassword: true,
    });
    return { success: true };
  }

  @Get("confirm/:token")
  async confirmation(@Param("token") token: string) {
    try {
      const hasBeenVerified = await this.userServ.ProfilVerified(token);
      return hasBeenVerified ? { seccess: true } : { success: false };
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Get(":id")
  async getUserById(@Param("id") id: string) {
    return await this.userModel.findById({ _id: id });
  }

  //!upddate 1 in all
  ///! forgetten password step 4 and others
  @Put("/updating")
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @UsePipes(new StatusPipe())
  @UsePipes(new BabyGenderPipe())
  async upadateAttribute(@Body() attributes: any, @Req() req: Request) {
    try {
      const token = req.headers.authorization.split("")[1];
      this.tikenAnlyse.isValidToken(token);
      if (attributes) {
        return await this.userServ.updateAttributeService(token, attributes);
      } else {
        return new Error(`${attributes} is empty or not valid !`);
      }
    } catch (e) {
      return new Exception("Something went wrong maybe the token is not valid");
    }
  }
}
