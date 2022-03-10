import { intFileName } from "../utils/filename_inter";
import { extname, join } from "path";
import { InjectModel } from "@nestjs/mongoose";
import { inscriptionDto, upadatePasswordDto } from "./models/userDto";

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
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { BabyGenderPipe, StatusPipe } from "src/pipes/customPipes";
import { JwtAuthGuard } from "src/auth/guards/auth.guard";
import { User } from "./models/users.model";
import { Model } from "mongoose";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(
    private readonly userServ: UsersService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  @Post("upload")
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
