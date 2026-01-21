import { OmitType } from "@nestjs/mapped-types";
import { ArrayNotEmpty, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { IsArrayOfObjects } from "src/common/decorators/is-array-of-objects.decorator";
import { CreateTransactionDto } from "./create-transaction.dto";
import { UpdateTransactionItemDto } from "./update-transaction-item.dto";

export class UpdateTransactionDto extends OmitType(CreateTransactionDto, [
  "vehicleId",
] as const) {
  @IsArrayOfObjects()
  @ArrayNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateTransactionItemDto)
  items: UpdateTransactionItemDto[];
}
