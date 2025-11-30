import { IsEnum, IsString } from "class-validator";
import { TenantType } from "../tenants.interface";

export class CreateTenantDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(TenantType)
  type: TenantType;
}
