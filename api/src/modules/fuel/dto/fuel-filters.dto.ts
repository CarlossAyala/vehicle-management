import { IsEnum, IsOptional } from "class-validator";
import { FiltersDto } from "src/common/filters/filters.dto";
import { FuelSortField } from "../fuel.interface";

export class FuelFiltersDto extends FiltersDto {
  @IsEnum(FuelSortField)
  @IsOptional()
  sort: FuelSortField = FuelSortField.CREATED_AT;
}
