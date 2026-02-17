import { Controller, Get, Param, Query } from "@nestjs/common";
import { Permissions } from "src/common/permissions/permissions.decorator";
import { UUIDParamPipe } from "src/common/pipes/uuid-param.pipe";
import { AuthData } from "../auth/auth.interface";
import { GetAuth } from "../auth/auth.decorator";
import { Operation } from "./entities/operation.entity";
import { OperationService } from "./operation.service";
import { OperationFiltersDto } from "./dto/operation-filters.dto";

@Controller("operations")
export class OperationController {
  constructor(private readonly service: OperationService) {}

  @Permissions("OPERATIONS", "READ")
  @Get()
  findAll(@GetAuth() auth: AuthData, @Query() filters: OperationFiltersDto) {
    return this.service.findAll(auth.tenantId!, filters);
  }

  @Get("stats")
  stats(@GetAuth() auth: AuthData) {
    return this.service.stats(auth.tenantId!);
  }

  @Permissions("OPERATIONS", "READ")
  @Get(":id")
  findOne(
    @GetAuth() auth: AuthData,
    @Param("id", UUIDParamPipe) id: Operation["id"],
  ) {
    return this.service.findOne(auth.tenantId!, id);
  }

  @Permissions("OPERATIONS", "READ")
  @Get(":id/entity")
  findEntity(
    @GetAuth() auth: AuthData,
    @Param("id", UUIDParamPipe) id: Operation["id"],
  ) {
    return this.service.findEntity(auth.tenantId!, id);
  }
}
