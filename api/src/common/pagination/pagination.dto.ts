import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  Max,
  Min,
} from "class-validator";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_MIN,
  DEFAULT_LIMIT,
  DEFAULT_LIMIT_MIN,
  DEFAULT_LIMIT_MAX,
} from "./pagination.constants";

export class PaginationDTO {
  @Min(DEFAULT_PAGE_MIN)
  @IsPositive()
  @IsInt()
  @IsNumber()
  @IsOptional()
  page: number = DEFAULT_PAGE;

  @Max(DEFAULT_LIMIT_MAX)
  @Min(DEFAULT_LIMIT_MIN)
  @IsPositive()
  @IsInt()
  @IsNumber()
  @IsOptional()
  limit: number = DEFAULT_LIMIT;
}
