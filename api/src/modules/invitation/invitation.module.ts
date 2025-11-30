import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "../user/user.module";
import { TenantsModule } from "../tenants/tenants.module";
import { Invitation } from "./entities/invitation.entity";
import { InvitationService } from "./invitation.service";
import { InvitationController } from "./invitation.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Invitation]), TenantsModule, UserModule],
  controllers: [InvitationController],
  providers: [InvitationService],
  exports: [InvitationService],
})
export class InvitationModule {}
