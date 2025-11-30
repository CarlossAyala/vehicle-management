import { IsInt, IsOptional, IsString } from "class-validator";

export class OdometerDto {
  @IsInt()
  value: number;

  @IsString()
  @IsOptional()
  description?: string;
}
