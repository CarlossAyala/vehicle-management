import { IsEnum, IsString } from "class-validator";
import { TransactionType } from "../transaction.interface";

export class TransactionDto {
  @IsEnum(TransactionType)
  type: TransactionType;

  @IsString()
  description: string = "";
}
