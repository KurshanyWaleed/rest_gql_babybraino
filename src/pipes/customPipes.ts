import { Situation, BabyGender } from "./../utils/enums";
/*

https://docs.nestjs.com/pipes
 
*/

import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from "@nestjs/common";

////!
/// ! this Pipe handls babyGender value
//  !
@Injectable()
export class BabyGenderPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log(value);
    if (value.babyGender) {
      if (!(value.babyGender in BabyGender)) {
        throw new BadRequestException(
          `${value.babyGender} is Invalid baby Gender value ! `,
        );
      } else {
        return value;
      }
    } else {
      return value;
    }
  }
}

////!
/// ! this Pipe handls status value
//  !
@Injectable()
export class StatusPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log(value);
    if (value.situation) {
      if (!(value.situation in Situation)) {
        throw new BadRequestException(
          `${value.situation} is  Invalid situation value ! `,
        );
      } else {
        return value;
      }
    } else {
      return value;
    }
  }
}
