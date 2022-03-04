import { JwtStrategy } from "./../auth/strategies/jwt.strategy";
import { AuthModule } from "./../auth/auth.module";
import { UsersService } from "src/users/userServices/users.service";
import { MongooseModule } from "@nestjs/mongoose";
import { forwardRef, Module } from "@nestjs/common";
import { UsersController } from "./userController/users.controller";
import { User, UserSchema } from "src/users/models/users.model";
import { UserRepository } from "./userRepository/user.repository";
import { UserResolver } from "./user.resolver";
import { AuthResolver } from "../auth/auth.resolve";

@Module({
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersService, UserRepository, JwtStrategy, UserResolver],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
