import { JwtService } from "@nestjs/jwt";

import { Injectable } from "@nestjs/common";
@Injectable()
export class Analyse {
  constructor(private readonly jwtServ: JwtService) {}
  isValidToken(token: string) {
    try {
      const valid = this.jwtServ.verify(token);
      return valid;
    } catch (e) {
      return e;
    }
  }
}
