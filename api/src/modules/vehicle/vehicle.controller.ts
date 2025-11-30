import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  Query,
} from "@nestjs/common";
import { Permissions } from "src/common/permissions/permissions.decorator";
import { UUIDParamPipe } from "src/common/pipes/uuid-param.pipe";
import { GetAuth } from "../auth/auth.decorator";
import { AuthData } from "../auth/auth.interface";
import { Vehicle } from "./entities/vehicle.entity";
import { CreateVehicleDto } from "./dto/create-vehicle.dto";
import { UpdateVehicleDto } from "./dto/update-vehicle.dto";
import { VehicleService } from "./vehicle.service";
import { VehicleFiltersDto } from "./dto/vehicle-filters.dto";

@Controller("vehicles")
export class VehicleController {
  constructor(private readonly service: VehicleService) {}

  @Permissions("VEHICLES", "CREATE")
  @Post()
  async create(
    @GetAuth() auth: AuthData,
    @Body() createVehicleDto: CreateVehicleDto,
  ): Promise<Vehicle> {
    return this.service.create(auth.tenantId!, createVehicleDto);
  }

  @Permissions("VEHICLES", "READ")
  @Get()
  findAll(@GetAuth() auth: AuthData, @Query() filters: VehicleFiltersDto) {
    return this.service.findAll(auth.tenantId!, filters);
  }

  @Permissions("VEHICLES", "READ")
  @Get(":id")
  findOne(
    @GetAuth() auth: AuthData,
    @Param("id", UUIDParamPipe) id: Vehicle["id"],
  ) {
    return this.service.findOne(auth.tenantId!, id);
  }

  @Permissions("VEHICLES", "UPDATE")
  @Patch(":id")
  update(
    @GetAuth() auth: AuthData,
    @Param("id", UUIDParamPipe) id: Vehicle["id"],
    @Body() updateVehicleDto: UpdateVehicleDto,
  ) {
    return this.service.update(auth.tenantId!, id, updateVehicleDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions("FUEL", "DELETE")
  @Delete(":id")
  async remove(
    @GetAuth() auth: AuthData,
    @Param("id", UUIDParamPipe) id: Vehicle["id"],
  ): Promise<void> {
    await this.service.remove(auth.tenantId!, id);
  }
}
