import { IsOptional, IsUUID } from "class-validator";
import { TransactionItem } from "../entities/transaction-item.entity";
import { CreateTransactionItemDto } from "./create-transaction-item.dto";

export class UpdateTransactionItemDto extends CreateTransactionItemDto {
  @IsUUID()
  @IsOptional()
  id?: TransactionItem["id"];
}
