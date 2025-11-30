import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaginationModule } from "src/common/pagination/pagination.module";
import { OperationModule } from "../operation/operation.module";
import { OdometerModule } from "../odometer/odometer.module";
import { Fuel } from "./entities/fuel.entity";
import { FuelService } from "./fuel.service";
import { FuelController } from "./fuel.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([Fuel]),
    OperationModule,
    OdometerModule,
    PaginationModule,
  ],
  controllers: [FuelController],
  providers: [FuelService],
  exports: [FuelService],
})
export class FuelModule {}
