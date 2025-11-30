import { IsEnum, IsOptional, IsString } from "class-validator";
import { TransactionType } from "../transaction.interface";

export class TransactionDto {
  @IsEnum(TransactionType)
  type: TransactionType;

  @IsString()
  @IsOptional()
  description?: string;
}
