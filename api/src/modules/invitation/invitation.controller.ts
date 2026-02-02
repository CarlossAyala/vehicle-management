import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Res,
} from "@nestjs/common";
import { Response } from "express";
import { Permissions } from "src/common/permissions/permissions.decorator";
import { UUIDParamPipe } from "src/common/pipes/uuid-param.pipe";
import { AuthData } from "../auth/auth.interface";
import {
  GetAuth,
  SkipAuth,
  SkipAuthRoles,
  SkipAuthTenant,
} from "../auth/auth.decorator";
import { AUTH_COOKIE_CONFIG, AUTH_COOKIE_NAME } from "../auth/auth.constants";
import { Invitation } from "./entities/invitation.entity";
import { CreateInvitationDto } from "./dto/create-invitation.dto";
import { InvitationService } from "./invitation.service";
import { AcceptInvitationDto } from "./dto/accept-invitation.dto";

@Controller("invitations")
export class InvitationController {
  constructor(private readonly service: InvitationService) {}

  @Permissions("INVITATION", "CREATE")
  @Post()
  create(@GetAuth() auth: AuthData, @Body() dto: CreateInvitationDto) {
    return this.service.create(auth.tenantId!, auth.userId!, dto);
  }

  @Permissions("INVITATION", "READ")
  @Get("tenant")
  findAllTenant(@GetAuth() auth: AuthData) {
    return this.service.findAllTenant(auth.tenantId!);
  }

  @Permissions("INVITATION", "READ")
  @SkipAuthTenant()
  @Get("me")
  findAllUser(@GetAuth() auth: AuthData) {
    return this.service.findAllUser(auth.userId!);
  }

  @SkipAuthRoles()
  @Get(":id")
  findOneId(
    @GetAuth() auth: AuthData,
    @Param("id", UUIDParamPipe) id: Invitation["id"],
  ) {
    return this.service.findOneId(auth.tenantId!, auth.userId!, id);
  }

  @SkipAuth()
  @Get(":token/token")
  findOneToken(@Param("token") token: Invitation["token"]) {
    return this.service.findOneToken(token);
  }

  @SkipAuthTenant()
  @SkipAuthRoles()
  @Patch(":id/accept")
  accept(
    @GetAuth() auth: AuthData,
    @Param("id", UUIDParamPipe) id: Invitation["id"],
  ) {
    return this.service.accept(auth.userId!, id);
  }

  @SkipAuth()
  @Patch(":token/accept-public")
  async acceptPublic(
    @Res({ passthrough: true }) res: Response,
    @Param("token") token: Invitation["token"],
    @Body() dto: AcceptInvitationDto,
  ) {
    const { invitation, sessionId } = await this.service.acceptPublic(
      token,
      dto,
    );

    if (sessionId) {
      res.cookie(AUTH_COOKIE_NAME, sessionId, AUTH_COOKIE_CONFIG);
    }

    return invitation;
  }

  @SkipAuthTenant()
  @SkipAuthRoles()
  @Patch(":id/reject")
  reject(
    @GetAuth() auth: AuthData,
    @Param("id", UUIDParamPipe) id: Invitation["id"],
  ) {
    return this.service.reject(auth.userId!, id);
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
