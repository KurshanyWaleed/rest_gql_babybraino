import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { LogInDto, RefreshTokenDto } from "src/users/models/userDto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(ValidationPipe)
  @Post("login")
  async login(@Body() userDataForlogIn: LogInDto) {
    let signedUser = await this.authService.validate(userDataForlogIn);
    console.log(signedUser);
    if (signedUser) {
      return this.authService.signIn(signedUser);
    } else {
      return signedUser;
    }
  }

  @Post("refresh_token")
  async refrechToken(@Body() ref_token: RefreshTokenDto) {
    let signedUser = await this.authService.verifyRefToken(ref_token.token);

    if (signedUser) {
      return this.authService.signIn(signedUser);
    } else {
      return signedUser;
      {
      }
    }
  }
}
