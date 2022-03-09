import { MailerModule } from "@nestjs-modules/mailer";
import { JwtStrategy } from "./../auth/strategies/jwt.strategy";
import { AuthModule } from "./../auth/auth.module";
import { UsersService } from "src/users/userServices/users.service";
import { MongooseModule } from "@nestjs/mongoose";
import { forwardRef, Module } from "@nestjs/common";
import { UsersController } from "./userController/users.controller";
import { User, UserSchema } from "src/users/models/users.model";
import { UserRepository } from "./userRepository/user.repository";
import { UserResolver } from "./user.resolver";
import { JwtModule } from "@nestjs/jwt";

import { EmailService } from "./userServices/email.service";
import { ConfigService } from "@nestjs/config";
import { MulterModule } from "@nestjs/platform-express";

@Module({
  imports: [
    forwardRef(() => AuthModule),
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get("EMAIL_HOST"),
          secure: false,
          auth: {
            user: config.get("EMAIL_USER"),
            pass: config.get("EMAIL_PASSWORD"),
          },
        },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      useFactory: async (configservice: ConfigService) => ({
        secret: configservice.get("SECRET"),
        signOptions: {
          expiresIn: configservice.get("JWT_EXPIRATION_TIME"),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    UsersService,
    UserRepository,
    JwtStrategy,
    UserResolver,
    EmailService,
  ],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
