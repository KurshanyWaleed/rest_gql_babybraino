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
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { BabyGenderPipe, StatusPipe } from "src/pipes/customPipes";
import { JwtAuthGuard } from "src/auth/guards/auth.guard";

@Controller("users")
export class UsersController {
  constructor(private readonly userServ: UsersService) {}

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
}
