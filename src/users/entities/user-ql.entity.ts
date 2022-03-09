import { Situation, BabyGender } from "../../utils/enums";
import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class UserQl {
  @Field(() => String)
  _id: String;
  @Field(() => String)
  userName: String;
  @Field(() => String)
  email: String;
  @Field(() => String)
  password: String;
  @Field(() => BabyGender)
  babyGender: BabyGender;
  @Field(() => Situation)
  situation: Situation;
  @Field(() => String)
  location: String;
  @Field(() => Boolean)
  verified: boolean;
  @Field(() => Boolean)
  photoProfile: boolean;
}
