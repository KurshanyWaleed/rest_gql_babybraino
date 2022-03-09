import * as mongoose from "mongoose";
import { BabyGender, Situation } from "src/utils/enums";

export const UserSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    situation: { type: String, required: true, enum: Situation },
    babyAge: { type: String, required: true },
    babyGender: { type: String, required: true, enum: BabyGender },
    location: { type: String, required: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    photoProfile: { type: String, required: false },
  },
  { timestamps: true },
);

export class User {
  _id: string;

  userName: string;

  situation: string;

  type: string;

  babyGender: BabyGender;

  babyAge: Situation;

  email: string;

  location: string;

  password: string;

  verified: false;

  photoProfile: "";
}
