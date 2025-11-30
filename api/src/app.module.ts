import { APP_GUARD } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { UserModule } from "./modules/user/user.module";
import { TenantsModule } from "./modules/tenants/tenants.module";
import { UserTenantModule } from "./modules/user-tenant/user-tenant.module";
import { VehicleModule } from "./modules/vehicle/vehicle.module";
import { SessionsModule } from "./modules/sessions/sessions.module";
import { AuthModule } from "./modules/auth/auth.module";
import { AuthGuard } from "./modules/auth/guards/auth.guard";
import { OperationModule } from "./modules/operation/operation.module";
import { CategoryModule } from "./modules/category/category.module";
import { OdometerModule } from "./modules/odometer/odometer.module";
import { ServiceModule } from "./modules/service/service.module";
import { TransactionModule } from "./modules/transaction/transaction.module";
import { PermissionsGuard } from "./common/permissions/permissions.guard";
import { FuelModule } from "./modules/fuel/fuel.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { InvitationModule } from "./modules/invitation/invitation.module";

@Module({
  imports: [
    // TODO: Move those to .env
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "carlos_ayala",
      password: "f1f86524b1f7a7869c6b1a19d1a15afd",
      database: "vehicle_management",
      entities: [],
      autoLoadEntities: true,
      // TODO: set to false in production
      synchronize: true,
    }),
    UserModule,
    TenantsModule,
    UserTenantModule,
    AuthModule,
    SessionsModule,
    OperationModule,
    CategoryModule,
    VehicleModule,
    FuelModule,
    OdometerModule,
    ServiceModule,
    TransactionModule,
    InvitationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {}
