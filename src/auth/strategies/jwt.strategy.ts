import { ConfigService } from "@nestjs/config";
import { UsersService } from "src/users/userServices/users.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userservice: UsersService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("SECRET"),
    });
  }
  async validate(validationPayoad: any) {
    console.log(validationPayoad);
    let user = await this.userservice.getUserByUserNameService(
      validationPayoad.userName,
    );
    console.log(user);
    if (user) {
      const { password, ...res } = user;
      return res;
    } else {
      throw new UnauthorizedException("here");
    }
  }
}
