import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from "@nestjs/common";
import { UUIDParamPipe } from "src/common/pipes/uuid-param.pipe";
import { GetAuth, SkipAuthRoles, SkipAuthTenant } from "../auth/auth.decorator";
import { User } from "../user/entities/user.entity";
import { AuthData } from "../auth/auth.interface";
import { Tenant } from "./entities/tenant.entity";
import { CreateTenantDto } from "./dto/create-tenant.dto";
import { TenantsService } from "./tenants.service";
import { UpdateRolesDto } from "./dto/update-roles.dto";

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

  @SkipAuthRoles()
  @Get("members")
  findMembers(@GetAuth() auth: AuthData) {
    return this.service.findMembers(auth.tenantId!);
  }

  @SkipAuthTenant()
  @Get(":id")
  findOne(
    @GetAuth() auth: AuthData,
    @Param("id", UUIDParamPipe) id: Tenant["id"],
  ) {
    return this.service.findOne(auth.userId!, id);
  }

  @Patch("members/:userId")
  updateRoles(
    @GetAuth() auth: AuthData,
    @Param("userId", UUIDParamPipe) userId: User["id"],
    @Body() dto: UpdateRolesDto,
  ) {
    return this.service.updateRoles(auth.tenantId!, userId, dto);
  }

  @Delete("members/:userId")
  removeMember(
    @GetAuth() auth: AuthData,
    @Param("userId", UUIDParamPipe) userId: User["id"],
  ) {
    return this.service.removeMember(auth.tenantId!, userId);
  }
}
