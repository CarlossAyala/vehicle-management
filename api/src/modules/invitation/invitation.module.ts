import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "../user/user.module";
import { TenantsModule } from "../tenants/tenants.module";
import { AuthModule } from "../auth/auth.module";
import { Invitation } from "./entities/invitation.entity";
import { InvitationService } from "./invitation.service";
import { InvitationController } from "./invitation.controller";
import { SessionsModule } from "../sessions/sessions.module";
import { UserTenantModule } from "../user-tenant/user-tenant.module";

/**
 * #TODO
 * - At Controller, refactor accept and accept-public refactoring
 * auth guards making auth optional
 */

@Module({
  imports: [
    TypeOrmModule.forFeature([Invitation]),
    TenantsModule,
    UserModule,
    AuthModule,
    SessionsModule,
    UserTenantModule,
  ],
  controllers: [InvitationController],
  providers: [InvitationService],
  exports: [InvitationService],
})
export class InvitationModule {}
