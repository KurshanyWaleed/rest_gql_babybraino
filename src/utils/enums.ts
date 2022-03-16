import { registerEnumType } from "@nestjs/graphql";

export enum Situation {
  EXPECTANT_NEW_BABY = "EXPECTANT_NEW_BABY",
  PERENT = "PERENT",
  PARENT_AND_EXPECTANT_NEW_BABY = "PARENT_AND_EXPECTANT_NEW_BABY",
}

export enum UserType {
  ADMIN = "ADMIN",
  USER = "USER",
}
export enum BabyGender {
  BOY = "BOY",
  GIRL = "GIRL",
}

registerEnumType(Situation, {
  name: "Situation",
});

registerEnumType(UserType, {
  name: "UserType",
});

registerEnumType(BabyGender, {
  name: "BabyGender",
});
