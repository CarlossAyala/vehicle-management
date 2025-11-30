import { IsEnum, IsOptional } from "class-validator";
import { FiltersDto } from "src/common/filters/filters.dto";
import { VehicleSortField } from "../vehicle.interface";

export class VehicleFiltersDto extends FiltersDto {
  @IsEnum(VehicleSortField)
  @IsOptional()
  sort: VehicleSortField = VehicleSortField.CREATED_AT;
}
