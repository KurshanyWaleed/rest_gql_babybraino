import { registerEnumType } from "@nestjs/graphql";

export enum Situation {
  EXPECTANT_NEW_BABY = "EXPECTANT_NEW_BABY",
  PERENT = "PERENT",
  PARENT_AND_EXPECTANT_NEW_BABY = "PARENT_AND_EXPECTANT_NEW_BABY",
}

export enum BabyGender {
  BOY = "BOY",
  GIRL = "GIRL",
}

registerEnumType(Situation, {
  name: "Situation",
});

registerEnumType(BabyGender, {
  name: "BabyGenderQL",
});
