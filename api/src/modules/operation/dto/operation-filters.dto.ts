import { IsEnum, IsOptional } from "class-validator";
import { FiltersDto } from "src/common/filters/filters.dto";
import { OperationSortField } from "../operation.interface";

export class OperationFiltersDto extends FiltersDto {
  @IsEnum(OperationSortField)
  @IsOptional()
  sort: OperationSortField = OperationSortField.CREATED_AT;
}
