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
import { Fuel } from "./entities/fuel.entity";
import { CreateFuelDto } from "./dto/create-fuel.dto";
import { UpdateFuelDto } from "./dto/update-fuel.dto";
import { FuelFiltersDto } from "./dto/fuel-filters.dto";
import { FuelService } from "./fuel.service";

@Controller("fuel")
export class FuelController {
  constructor(private readonly service: FuelService) {}

  @Permissions("FUEL", "CREATE")
  @Post()
  create(@GetAuth() auth: AuthData, @Body() dto: CreateFuelDto) {
    return this.service.create(
      {
        tenantId: auth.tenantId!,
        userId: auth.userId!,
      },
      dto,
    );
  }

  @Permissions("FUEL", "READ")
  @Get("")
  findAll(@GetAuth() auth: AuthData, @Query() filters: FuelFiltersDto) {
    return this.service.findAll(auth.tenantId!, filters);
  }

  @Get("stats")
  stat(@GetAuth() auth: AuthData) {
    return this.service.stats(auth.tenantId!);
  }

  @Permissions("FUEL", "READ")
  @Get(":id")
  findOne(
    @GetAuth() auth: AuthData,
    @Param("id", UUIDParamPipe) id: Fuel["id"],
  ) {
    return this.service.findOne(auth.tenantId!, id);
  }

  @Permissions("FUEL", "UPDATE")
  @Patch(":id")
  update(
    @GetAuth() auth: AuthData,
    @Param("id", UUIDParamPipe) id: Fuel["id"],
    @Body() dto: UpdateFuelDto,
  ) {
    return this.service.update(auth.tenantId!, id, dto);
  }

  @Permissions("FUEL", "DELETE")
  @Delete(":id")
  remove(
    @GetAuth() auth: AuthData,
    @Param("id", UUIDParamPipe) id: Fuel["id"],
  ) {
    return this.service.remove(auth.tenantId!, id);
  }
}
