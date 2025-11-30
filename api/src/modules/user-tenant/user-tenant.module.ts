import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserTenant } from "./entities/user-tenant.entity";
import { UserTenantService } from "./user-tenant.service";
import { UserTenantController } from "./user-tenant.controller";

@Module({
  imports: [TypeOrmModule.forFeature([UserTenant])],
  controllers: [UserTenantController],
  providers: [UserTenantService],
  exports: [UserTenantService],
})
export class UserTenantModule {}
