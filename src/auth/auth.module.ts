import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "../users/users.module";
import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PassportModule } from "@nestjs/passport";
import { AuthResolver } from "./auth.resolve";

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      useFactory: async (configservice: ConfigService) => ({
        secretOrKeyProvider: configservice.get("SECRET"),
        signOptions: {
          expiresIn: configservice.get("JWT_EXPIRATION_TIME"),
        },
      }),
      inject: [ConfigService],
    }),

    PassportModule.register({ defaultStrategy: "jwt" }),
  ],

  controllers: [AuthController],
  providers: [AuthService, JwtModule, AuthResolver],
})
export class AuthModule {}
