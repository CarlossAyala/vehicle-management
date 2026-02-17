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
import { Permissions } from "src/common/permissions/permissions.decorator";
import { UUIDParamPipe } from "src/common/pipes/uuid-param.pipe";
import { GetAuth } from "../auth/auth.decorator";
import { AuthData } from "../auth/auth.interface";
import { Service } from "./entities/service.entity";
import { CreateServiceDto } from "./dto/create-service.dto";
import { UpdateServiceDto } from "./dto/update-service.dto";
import { ServiceFiltersDto } from "./dto/service-filters.dto";
import { ServiceService } from "./service.service";

@Controller("services")
export class ServiceController {
  constructor(private readonly service: ServiceService) {}

  @Permissions("SERVICE", "CREATE")
  @Post()
  create(@GetAuth() auth: AuthData, @Body() dto: CreateServiceDto) {
    return this.service.create(auth.tenantId!, auth.userId!, dto);
  }

  @Permissions("SERVICE", "READ")
  @Get("")
  findAll(@GetAuth() auth: AuthData, @Query() filters: ServiceFiltersDto) {
    return this.service.findAll(auth.tenantId!, filters);
  }

  @Get("stats")
  stats(@GetAuth() auth: AuthData) {
    return this.service.stats(auth.tenantId!);
  }

  @Permissions("SERVICE", "READ")
  @Get(":id")
  findOne(
    @GetAuth() auth: AuthData,
    @Param("id", UUIDParamPipe) id: Service["id"],
  ) {
    return this.service.findOne(auth.tenantId!, id);
  }

  @Permissions("SERVICE", "UPDATE")
  @Patch(":id")
  update(
    @GetAuth() auth: AuthData,
    @Param("id", UUIDParamPipe) id: Service["id"],
    @Body() dto: UpdateServiceDto,
  ) {
    return this.service.update(auth.tenantId!, id, dto);
  }

  @Permissions("SERVICE", "DELETE")
  @Delete(":id")
  remove(
    @GetAuth() auth: AuthData,
    @Param("id", UUIDParamPipe) id: Service["id"],
  ) {
    return this.service.remove(auth.tenantId!, id);
  }
}
