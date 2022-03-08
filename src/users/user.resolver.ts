import { inscriptionDto } from "./models/userDto";
import { LogInDto } from "src/users/models/userDto";
import { UsersService } from "src/users/userServices/users.service";
import { Args, Mutation, Query } from "@nestjs/graphql";
import { Resolver } from "@nestjs/graphql";
import { UserQl } from "./entities/user-ql.entity";
import { UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/auth.guard";

@Resolver("User")
export class UserResolver {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(JwtAuthGuard)
  @Query(() => [UserQl], { name: "getUsers" })
  getUsers() {
    return this.usersService.getUsersService();
  }
  @UsePipes(ValidationPipe)
  @Mutation(() => Boolean, { name: "signUp" })
  signUp(@Args("inputData") user: inscriptionDto) {
    return this.usersService.signUpUserService(user);
  }
}
