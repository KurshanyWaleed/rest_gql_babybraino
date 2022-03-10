import { Upload } from "src/utils/scalar";
import { GraphQLUpload } from "graphql-upload";
import {
  inscriptionDto,
  UploadUserProfilePicInput,
  UserUploadProfilePicType,
} from "./models/userDto";
import { UsersService } from "src/users/users.service";
import { Args, Mutation, Query } from "@nestjs/graphql";
import { Resolver } from "@nestjs/graphql";
import { UserQl } from "./entities/user-ql.entity";
import {
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
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

  // @Mutation(() => Boolean)
  // @UseInterceptors(
  //   FileInterceptor("photoProfile", {
  //     storage: diskStorage({
  //       destination: "./uploads",
  //       filename: intFileName,
  //     }),
  //   }),
  // )

  @Mutation(() => UserUploadProfilePicType)
  public async uploadProfilePic(
    @Args("UploadUserProfilePicInput") { file }: UploadUserProfilePicInput,
  ) {
    const fileData = await file;
    console.log(fileData);
  }
}
