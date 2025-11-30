import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { TenantsModule } from "../tenants/tenants.module";
import { SessionsModule } from "../sessions/sessions.module";
import { UserTenantModule } from "../user-tenant/user-tenant.module";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";

@Module({
  imports: [UserModule, TenantsModule, SessionsModule, UserTenantModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
