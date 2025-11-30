import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaginationModule } from "src/common/pagination/pagination.module";
import { CategoryModule } from "../category/category.module";
import { VehicleModule } from "../vehicle/vehicle.module";
import { OdometerModule } from "../odometer/odometer.module";
import { Operation } from "./entities/operation.entity";
import { OperationService } from "./operation.service";
import { OperationController } from "./operation.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([Operation]),
    CategoryModule,
    VehicleModule,
    forwardRef(() => OdometerModule),
    PaginationModule,
  ],
  controllers: [OperationController],
  providers: [OperationService],
  exports: [OperationService],
})
export class OperationModule {}
