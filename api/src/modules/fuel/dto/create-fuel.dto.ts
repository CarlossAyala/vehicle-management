import { Type } from "class-transformer";
import { IsObject, ValidateNested } from "class-validator";
import { CreateOperationDto } from "src/modules/operation/dto/create-operation.dto";
import { FuelDto } from "./fuel.dto";

export class CreateFuelDto extends CreateOperationDto {
  @ValidateNested()
  @Type(() => FuelDto)
  @IsObject()
  fuel: FuelDto;
}
