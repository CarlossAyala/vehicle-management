import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { UUIDParamPipe } from "src/common/pipes/uuid-param.pipe";
import { Permissions } from "src/common/permissions/permissions.decorator";
import { Operation } from "../operation/entities/operation.entity";
import { GetAuth } from "../auth/auth.decorator";
import { AuthData } from "../auth/auth.interface";
import { Odometer } from "./entities/odometer.entity";
import { CreateOdometerDto } from "./dto/create-odometer.dto";
import { UpdateOdometerDto } from "./dto/update-odometer.dto";
import { OdometerFiltersDto } from "./dto/odometer-filters.dto";
import { OdometerService } from "./odometer.service";

@Controller("odometers")
export class OdometerController {
  constructor(private readonly service: OdometerService) {}

  @Permissions("ODOMETER", "CREATE")
  @Post()
  create(@GetAuth() auth: AuthData, @Body() dto: CreateOdometerDto) {
    return this.service.create(
      {
        tenantId: auth.tenantId!,
        userId: auth.userId!,
      },
      dto,
    );
  }

  @Permissions("ODOMETER", "READ")
  @Get("")
  findAll(@GetAuth() auth: AuthData, @Query() filters: OdometerFiltersDto) {
    return this.service.findAll(auth.tenantId!, filters);
  }

  @Permissions("ODOMETER", "READ")
  @Get("by-operation/:id")
  findByOperation(
    @GetAuth() auth: AuthData,
    @Param("id", UUIDParamPipe) id: Operation["id"],
  ) {
    return this.service.findByOperation(auth.tenantId!, id);
  }

  @Permissions("ODOMETER", "READ")
  @Get(":id")
  findOne(
    @GetAuth() auth: AuthData,
    @Param("id", UUIDParamPipe) id: Odometer["id"],
  ) {
    return this.service.findOne(auth.tenantId!, id);
  }

  @Permissions("ODOMETER", "READ")
  @Patch(":id")
  update(
    @GetAuth() auth: AuthData,
    @Param("id", UUIDParamPipe) id: Odometer["id"],
    @Body() dto: UpdateOdometerDto,
  ) {
    return this.service.update(auth.tenantId!, id, dto);
  }

  @Permissions("ODOMETER", "DELETE")
  @Delete(":id")
  remove(
    @GetAuth() auth: AuthData,
    @Param("id", UUIDParamPipe) id: Odometer["id"],
  ) {
    return this.service.remove(auth.tenantId!, id);
  }
}
