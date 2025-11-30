import { IsOptional, IsString } from "class-validator";

export class ServiceDto {
  @IsString()
  @IsOptional()
  description?: string;
}
