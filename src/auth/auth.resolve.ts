import { LogInDto } from "src/users/models/userDto";
import { Resolver, Mutation, Args } from "@nestjs/graphql";

import { AuthService } from "./auth.service";

@Resolver("Auth")
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => String, { name: "" })
  async signIn(@Args("login") user: LogInDto) {
    let signedUser = await this.authService.validate(user);
    console.log(signedUser);
    if (signedUser) {
      return this.authService.signIn(signedUser);
    } else {
      return signedUser;
    }
  }
}
