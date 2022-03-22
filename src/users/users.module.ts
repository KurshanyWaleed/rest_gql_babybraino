import { MailerModule } from "@nestjs-modules/mailer";
import { JwtStrategy } from "./../auth/strategies/jwt.strategy";
import { AuthModule } from "./../auth/auth.module";
import { UsersService } from "src/users/users.service";
import { MongooseModule } from "@nestjs/mongoose";
import { forwardRef, HttpModule, Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { User, UserSchema } from "src/users/models/users.model";
import { UserRepository } from "./user.repository";
import { UserResolver } from "./user.resolver";
import { JwtModule } from "@nestjs/jwt";
import { EmailService } from "./user.mail.confi.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MulterModule } from "@nestjs/platform-express";
import { Upload } from "src/utils/scalar";
import { Analyse } from "./token_analyse";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { MAIN_QUEUE, USER_SERVICES } from "src/utils/constantes";

const option = {
  useFactory: async (config: ConfigService) => ({
    name: "USER_SERVICESS",
    transport: Transport.RMQ,
    options: {
      name: "USER_SERVICESS",
      urls: [await config.get("RQ_SERVER")],
      queue: MAIN_QUEUE,
      queueOptions: {
        durable: false,
      },
    },
  }),
};

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.registerAsync([
      {
        name: USER_SERVICES,
        useFactory: async (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [config.get<string>("RQ_SERVER")],
            queue: MAIN_QUEUE,
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: "./uploads",
      }),
    }),

    forwardRef(() => AuthModule),
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          service: "gmail",
          auth: {
            user: config.get<string>("EMAIL"),
            pass: config.get("PASS"),
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
    Analyse,
  ],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
