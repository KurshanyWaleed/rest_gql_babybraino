import { MailerModule } from "@nestjs-modules/mailer";
import { JwtStrategy } from "./../auth/strategies/jwt.strategy";
import { AuthModule } from "./../auth/auth.module";
import { UsersService } from "src/users/users.service";
import { MongooseModule } from "@nestjs/mongoose";
import { forwardRef, Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { User, UserSchema } from "src/users/models/users.model";
import { UserRepository } from "./user.repository";
import { UserResolver } from "./user.resolver";
import { JwtModule } from "@nestjs/jwt";

import { EmailService } from "./user.mail.confi.service";
import { ConfigService } from "@nestjs/config";
import { MulterModule } from "@nestjs/platform-express";
import { Upload } from "src/utils/scalar";

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: "./uploads",
      }),
    }),

    forwardRef(() => AuthModule),
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: "smtp.ethereal.email",
          port: 587,
          auth: {
            user: "constance.connelly32@ethereal.email",
            pass: "wEdcXm9NJa3cbWujzS",
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
    Upload,
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
