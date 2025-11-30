import { Controller, Get, Post, Body, Param, Delete } from "@nestjs/common";
import { Permissions } from "src/common/permissions/permissions.decorator";
import { UUIDParamPipe } from "src/common/pipes/uuid-param.pipe";
import { AuthData } from "../auth/auth.interface";
import { GetAuth, SkipAuthTenant } from "../auth/auth.decorator";
import { Invitation } from "./entities/invitation.entity";
import { CreateInvitationDto } from "./dto/create-invitation.dto";
import { InvitationService } from "./invitation.service";

@Controller("invitations")
export class InvitationController {
  constructor(private readonly service: InvitationService) {}

  @Permissions("INVITATION", "CREATE")
  @Post()
  create(@GetAuth() auth: AuthData, @Body() dto: CreateInvitationDto) {
    return this.service.create(auth.tenantId!, auth.userId!, dto);
  }

  @Permissions("INVITATION", "READ")
  @SkipAuthTenant()
  @Get()
  findAll(@GetAuth() auth: AuthData) {
    return this.service.findAll(auth.tenantId!);
  }

  @SkipAuthTenant()
  @Get("received")
  findReceived(@GetAuth() auth: AuthData) {
    return this.service.findReceived(auth.tenantId!, auth.userId!);
  }

  @Get("sent")
  findSent(@GetAuth() auth: AuthData) {
    return this.service.findSent(auth.tenantId!);
  }

  @SkipAuthTenant()
  @Permissions("INVITATION", "READ")
  @Get(":id")
  findOne(
    @GetAuth() auth: AuthData,
    @Param("id", UUIDParamPipe) id: Invitation["id"],
  ) {
    return this.service.findOne(auth.tenantId!, id);
  }

  @Permissions("INVITATION", "DELETE")
  @Delete(":id")
  remove(
    @GetAuth() auth: AuthData,
    @Param("id", UUIDParamPipe) id: Invitation["id"],
  ) {
    return this.service.remove(auth.tenantId!, id);
  }
}
