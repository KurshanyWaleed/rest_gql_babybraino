import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { User } from "src/users/models/users.model";

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findUserByLocation(location: string) {
    let user = await this.userModel.find({ location });
    return user;
  }

  async findUserByUsername(userName: string) {
    let user = await this.userModel.findOne({ userName });
    return user;
  }

  async findUserByUsernameAndEmail(userName: string, email: string) {
    let user = await this.userModel.findOne({ userName, email });
    return user;
  }
}
