import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsEmail, IsEmpty, IsNotEmpty, Length } from "class-validator";
import { BabyGender, Situation } from "src/utils/enums";
import { Upload } from "src/utils/scalar";

@InputType()
export class RefreshTokenDto {
  @IsNotEmpty()
  token: string;
}

@InputType()
export class LogInDto {
  @Field(() => String)
  @IsNotEmpty()
  userName: string;
  @Field(() => String)
  @IsNotEmpty()
  @Length(6)
  password: string;
}

@InputType()
export class UploadUserProfilePicInput {
  @Field()
  file: Upload;
}
// @InputType()
// export class UploadUserProfilePicInput {
//   @Field(() => Upload)
//   file: Upload;
//   @Field(() => String)
//   userName: string;
// }
@ObjectType("UserUploadProfilePicType")
export class UserUploadProfilePicType {
  @Field()
  success: boolean;
}
// @InputType()
// export class UploadProfilPhoto {
//   @Field(() => String)
//   file: string;
//   @Field(() => String)
//   userName: string;
// }

@InputType()
export class inscriptionDto {
  @Field(() => String)
  @IsNotEmpty()
  userName: string;

  @Field(() => String)
  @IsNotEmpty()
  @Length(6)
  password: string;

  @Field(() => Situation)
  @IsNotEmpty()
  situation: Situation;

  @Field(() => BabyGender)
  @IsNotEmpty()
  babyGender: BabyGender;

  @Field(() => String)
  @IsNotEmpty()
  babyAge: string;

  @Field(() => String)
  @IsNotEmpty()
  location: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @Field(() => String)
  @IsEmpty()
  photoProfile: String;
  @Field(() => String)
  @IsEmpty()
  verified: string;
}
export class ConfirmEmailToUpadatePasswordDto {
  @IsNotEmpty()
  email: string;
}
@ObjectType()
export class SignInresult {
  @Field(() => String)
  access_token: String;
  @Field(() => String)
  refresh_token: String;
}
