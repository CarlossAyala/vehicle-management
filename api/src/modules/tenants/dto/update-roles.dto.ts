import { ArrayNotEmpty, ArrayUnique, IsArray, IsEnum } from "class-validator";
import { TenantRole } from "src/modules/user-tenant/user-tenant.interface";

export class UpdateRolesDto {
  @ArrayUnique()
  @IsEnum(TenantRole, { each: true })
  @ArrayNotEmpty()
  @IsArray()
  roles: TenantRole[];
}
