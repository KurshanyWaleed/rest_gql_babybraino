import { AuthService } from "./auth.service";
import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { LogInDto } from "src/users/models/userDto";
import { JwtAuthGuard } from "./guards/auth.guard";

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
}
