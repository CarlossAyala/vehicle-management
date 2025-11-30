import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { UUIDParamPipe } from "src/common/pipes/uuid-param.pipe";
import { GetAuth, SkipAuthTenant } from "../auth/auth.decorator";
import { AuthData } from "../auth/auth.interface";
import { Tenant } from "./entities/tenant.entity";
import { CreateTenantDto } from "./dto/create-tenant.dto";
import { UpdateTenantDto } from "./dto/update-tenant.dto";
import { TenantsService } from "./tenants.service";

@Controller("tenants")
export class TenantsController {
  constructor(private readonly service: TenantsService) {}

  @SkipAuthTenant()
  @Post()
  create(@GetAuth() auth: AuthData, @Body() dto: CreateTenantDto) {
    return this.service.create(auth.userId!, dto);
  }

  @SkipAuthTenant()
  @Get()
  findAll(@GetAuth() auth: AuthData) {
    return this.service.findAll(auth.userId!);
  }

  @SkipAuthTenant()
  @Get(":id")
  findOne(
    @GetAuth() auth: AuthData,
    @Param("id", UUIDParamPipe) id: Tenant["id"],
  ) {
    return this.service.findOne(auth.userId!, id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateTenantDto: UpdateTenantDto) {
    return this.service.update(+id, updateTenantDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(+id);
  }
}
