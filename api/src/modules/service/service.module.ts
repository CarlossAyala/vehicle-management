import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OperationModule } from "../operation/operation.module";
import { Service } from "./entities/service.entity";
import { ServiceItem } from "./entities/service-item.entity";
import { ServiceService } from "./service.service";
import { ServiceController } from "./service.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Service, ServiceItem]), OperationModule],
  controllers: [ServiceController],
  providers: [ServiceService],
  exports: [ServiceService],
})
export class ServiceModule {}
