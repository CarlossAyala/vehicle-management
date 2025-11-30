import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { Permissions } from "src/common/permissions/permissions.decorator";
import { UUIDParamPipe } from "src/common/pipes/uuid-param.pipe";
import { GetAuth } from "../auth/auth.decorator";
import { AuthData } from "../auth/auth.interface";
import { Service } from "./entities/service.entity";
import { CreateServiceDto } from "./dto/create-service.dto";
import { UpdateServiceDto } from "./dto/update-service.dto";
import { ServiceService } from "./service.service";

@Controller("services")
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Permissions("SERVICE", "CREATE")
  @Post()
  create(@GetAuth() auth: AuthData, @Body() dto: CreateServiceDto) {
    return this.serviceService.create(auth.tenantId!, auth.userId!, dto);
  }

  @Permissions("SERVICE", "READ")
  @Get(":id")
  findOne(
    @GetAuth() auth: AuthData,
    @Param("id", UUIDParamPipe) id: Service["id"],
  ) {
    return this.serviceService.findOne(auth.tenantId!, id);
  }

  @Permissions("SERVICE", "UPDATE")
  @Patch(":id")
  update(
    @GetAuth() auth: AuthData,
    @Param("id", UUIDParamPipe) id: Service["id"],
    @Body() dto: UpdateServiceDto,
  ) {
    return this.serviceService.update(auth.tenantId!, id, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions("SERVICE", "DELETE")
  @Delete(":id")
  remove(
    @GetAuth() auth: AuthData,
    @Param("id", UUIDParamPipe) id: Service["id"],
  ) {
    return this.serviceService.remove(auth.tenantId!, id);
  }
}
