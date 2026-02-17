import { APP_GUARD } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
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
import { InvitationModule } from "./modules/invitation/invitation.module";
// import { PermissionsGuard } from "./common/permissions/permissions.guard";
import { FuelModule } from "./modules/fuel/fuel.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { EnvironmentVariables, validate, validateNodeEnv } from "./config/envs";

const env = validateNodeEnv();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: `.env.${env}`,
      validate,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (service: ConfigService<EnvironmentVariables>) => {
        return {
          type: "postgres",
          host: service.get("DATABASE_HOST"),
          port: +service.get("DATABASE_PORT"),
          username: service.get("DATABASE_USERNAME"),
          password: service.get("DATABASE_PASSWORD"),
          database: service.get("DATABASE_NAME"),
          entities: [],
          autoLoadEntities: true,
          synchronize: false,
        };
      },
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
    // {
    //   provide: APP_GUARD,
    //   useClass: PermissionsGuard,
    // },
  ],
})
export class AppModule {}
