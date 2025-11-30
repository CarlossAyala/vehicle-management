import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { CreateUsersTenantDto } from "./dto/create-users-tenant.dto";
import { UpdateUsersTenantDto } from "./dto/update-users-tenant.dto";
import { UserTenantService } from "./user-tenant.service";
import { Permissions } from "src/common/permissions/permissions.decorator";
import { GetAuth, SkipAuthTenant } from "../auth/auth.decorator";
import { AuthData } from "../auth/auth.interface";
import { UUIDParamPipe } from "src/common/pipes/uuid-param.pipe";
import { UserTenant } from "./entities/user-tenant.entity";

@Controller("users-tenants")
export class UserTenantController {
  constructor(private readonly service: UserTenantService) {}

  @Permissions("USERS_TENANTS", "CREATE")
  @Post()
  create(@Body() dto: CreateUsersTenantDto) {
    return this.service.create(dto);
  }

  @SkipAuthTenant()
  @Permissions("USERS_TENANTS", "READ")
  @Get()
  findAll(@GetAuth() auth: AuthData) {
    return this.service.findAll(auth.userId!);
  }

  @SkipAuthTenant()
  @Permissions("USERS_TENANTS", "READ")
  @Get(":id")
  findOne(
    @GetAuth() auth: AuthData,
    @Param("id", UUIDParamPipe) id: UserTenant["id"],
  ) {
    return this.service.findOne(auth.tenantId!, auth.userId!, id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateUsersTenantDto: UpdateUsersTenantDto,
  ) {
    return this.service.update(+id, updateUsersTenantDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(+id);
  }
}
