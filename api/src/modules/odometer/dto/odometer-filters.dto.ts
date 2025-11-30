import { IsEnum, IsOptional } from "class-validator";
import { FiltersDto } from "src/common/filters/filters.dto";
import { OdometerSortField } from "../odometer.interface";

export class OdometerFiltersDto extends FiltersDto {
  @IsEnum(OdometerSortField)
  @IsOptional()
  sort: OdometerSortField = OdometerSortField.CREATED_AT;
}
