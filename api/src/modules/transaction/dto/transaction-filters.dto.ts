import { IsEnum } from "class-validator";
import { FiltersDto } from "src/common/filters/filters.dto";
import { TransactionSortField } from "../transaction.interface";

export class TransactionFiltersDto extends FiltersDto {
  @IsEnum(TransactionSortField)
  sort: TransactionSortField = TransactionSortField.CREATED_AT;
}
