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
  signIn(user: User): string {
    const payload = { userName: user.userName, sub: user._id };
    return this.jwtService.sign(payload);
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
}
