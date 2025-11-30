import {
  ArrayNotEmpty,
  IsArray,
  IsObject,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { CreateOperationDto } from "src/modules/operation/dto/create-operation.dto";
import { IsArrayOfObjects } from "src/common/decorators/is-array-of-objects.decorator";
import { CreateTransactionItemDto } from "./create-transaction-item.dto";
import { TransactionDto } from "./transaction.dto copy";

export class CreateTransactionDto extends CreateOperationDto {
  @ValidateNested()
  @Type(() => TransactionDto)
  @IsObject()
  transaction: TransactionDto;

  @IsArrayOfObjects()
  @ArrayNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTransactionItemDto)
  items: CreateTransactionItemDto[];
}
