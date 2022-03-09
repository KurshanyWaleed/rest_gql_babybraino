import { ConfigService } from "@nestjs/config";
import { UsersService } from "src/users/userServices/users.service";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";

import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { User } from "src/users/models/users.model";
import { LogInDto } from "src/users/models/userDto";

@Injectable()
export class AuthService {
  constructor(
    private readonly userservice: UsersService,
    private readonly jwtService: JwtService,
    private readonly configserv: ConfigService,
  ) {}

  async validate(userData: LogInDto): Promise<User> {
    const user = await this.userservice.getUserByUserNameService(
      userData.userName,
    );
    if (!user) {
      throw new NotFoundException("Invalid credential");
    } else {
      const isMatch = await bcrypt.compare(userData.password, user.password);
      if (isMatch) {
        return user;
      } else throw new UnauthorizedException("Invalid credential !");
    }
  }
  //! ==>!
  async signIn(
    user: User,
  ): Promise<{ access_token: String; refresh_token: string }> {
    const payload = { userName: user.userName, sub: user._id };

    const token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configserv.get("SECRET_REF"),
      expiresIn: "1y",
    });

    return { access_token: token, refresh_token: refresh_token };
  }

  async verify(token: string) {
    const decoded = this.jwtService.verify(token, { secret: "secret" });

    let user = await this.userservice.getUserByUserNameService(
      decoded.username,
    );
    if (user) {
      return user;
    } else {
      throw new BadRequestException(
        "Unable to get the user from decoded token ",
      );
    }
  }

  async verifyRefToken(token: string) {
    const decoded = this.jwtService.verify(token, {
      secret: this.configserv.get("SECRET_REF"),
    });
    console.log(decoded);
    let user = await this.userservice.getUserByUserNameService(
      decoded.userName,
    );
    if (user) {
      return user;
    } else {
      throw new BadRequestException(
        "Unable to get the user from decoded token ",
      );
    }
  }
}
