import { IsEmail, IsEnum } from "class-validator";
import { TenantRole } from "src/modules/user-tenant/user-tenant.interface";

export class CreateInvitationDto {
  @IsEmail()
  email: string;

  @IsEnum(TenantRole)
  role: TenantRole;
}
