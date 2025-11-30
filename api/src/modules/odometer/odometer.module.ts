import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaginationModule } from "src/common/pagination/pagination.module";
import { OperationModule } from "../operation/operation.module";
import { Odometer } from "./entities/odometer.entity";
import { OdometerService } from "./odometer.service";
import { OdometerController } from "./odometer.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([Odometer]),
    forwardRef(() => OperationModule),
    PaginationModule,
  ],
  controllers: [OdometerController],
  providers: [OdometerService],
  exports: [OdometerService],
})
export class OdometerModule {}
