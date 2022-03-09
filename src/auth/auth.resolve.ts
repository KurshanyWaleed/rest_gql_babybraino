import { JwtAuthGuard } from "./guards/auth.guard";
import { LogInDto, SignInresult } from "src/users/models/userDto";
import { Resolver, Mutation, Args } from "@nestjs/graphql";

import { AuthService } from "./auth.service";

@Resolver("Auth")
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SignInresult, {
    name: "signIn",
  })
  async signIn(@Args("login") user: LogInDto) {
    let signedUser = await this.authService.validate(user);
    console.log(signedUser);
    if (signedUser) {
      const { access_token, refresh_token } = await this.authService.signIn(
        signedUser,
      );
      const result = new SignInresult();
      result.access_token = access_token;
      result.refresh_token = refresh_token;
      return result;
    } else {
      return signedUser;
    }
  }
}
