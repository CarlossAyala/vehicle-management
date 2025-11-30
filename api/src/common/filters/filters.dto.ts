import { IsEnum, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";
import { PaginationDTO } from "../pagination/pagination.dto";
import { SortOrders } from "./filters.interface";

export class FiltersDto extends PaginationDTO {
  @Transform(({ value }) => (value ? String(value).trim() : undefined))
  @IsString()
  @IsOptional()
  q?: string;

  @IsEnum(SortOrders)
  @IsOptional()
  order: SortOrders = SortOrders.DESC;
}
