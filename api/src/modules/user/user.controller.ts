import { Controller, Get, Param } from "@nestjs/common";
import { UUIDParamPipe } from "src/common/pipes/uuid-param.pipe";
import { Public } from "../auth/auth.decorator";
import { User } from "./entities/user.entity";
import { UserService } from "./user.service";

@Controller("users")
export class UserController {
  constructor(private readonly service: UserService) {}

  /*
   * #TODO: retrieve users should work only for those
   * users that are in the same tenant, but what what
   * to do with those who left them? Somehow users
   * should have an status (UserTenant) and its roles (UserRoles).
   * But by now, just make this endpoint public
   */
  @Public()
  @Get(":id")
  findOne(@Param("id", UUIDParamPipe) id: User["id"]) {
    return this.service.findOne(id);
  }
}
