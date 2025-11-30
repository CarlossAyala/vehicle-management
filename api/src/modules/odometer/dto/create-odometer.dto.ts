import { OmitType } from "@nestjs/mapped-types";
import { IsObject, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreateOperationDto } from "src/modules/operation/dto/create-operation.dto";
import { OdometerDto } from "./odometer.dto";

export class CreateOdometerDto extends OmitType(CreateOperationDto, [
  "odometer",
] as const) {
  @ValidateNested()
  @Type(() => OdometerDto)
  @IsObject()
  odometer: OdometerDto;
}
