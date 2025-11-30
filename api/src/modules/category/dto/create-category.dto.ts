import { IsEnum, IsString } from "class-validator";
import { OperationType } from "src/modules/operation/operation.interface";

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsEnum(OperationType)
  source: OperationType;
}
