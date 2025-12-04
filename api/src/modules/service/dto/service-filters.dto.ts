import { IsEnum, IsOptional } from "class-validator";
import { FiltersDto } from "src/common/filters/filters.dto";
import { ServiceSortField } from "../service.interface";

export class ServiceFiltersDto extends FiltersDto {
  @IsEnum(ServiceSortField)
  @IsOptional()
  sort: ServiceSortField = ServiceSortField.CREATED_AT;
}
