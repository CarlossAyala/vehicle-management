import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Pagination } from "src/common/pagination/pagination.interface";
import { PaginationService } from "src/common/pagination/pagination.service";
import { Tenant } from "../tenants/entities/tenant.entity";
import { Vehicle } from "./entities/vehicle.entity";
import { CreateVehicleDto } from "./dto/create-vehicle.dto";
import { UpdateVehicleDto } from "./dto/update-vehicle.dto";
import { VehicleFiltersDto } from "./dto/vehicle-filters.dto";

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly repository: Repository<Vehicle>,
    private readonly dataSource: DataSource,
    private readonly paginationService: PaginationService,
  ) {}

  async create(
    tenantId: Tenant["id"],
    createVehicleDto: CreateVehicleDto,
  ): Promise<Vehicle> {
    const vehicle = this.repository.create({
      ...createVehicleDto,
      tenantId,
    });
    return this.repository.save(vehicle);
  }

  async findAll(
    tenantId: Tenant["id"],
    filters: VehicleFiltersDto,
  ): Promise<Pagination<Vehicle>> {
    const qb = this.dataSource.manager
      .createQueryBuilder(Vehicle, "vehicle")
      .where("vehicle.tenantId = :tenantId", { tenantId })
      .orderBy("vehicle." + filters.sort, filters.order);

    return this.paginationService.paginate(qb, filters);
  }

  async findOne(tenantId: Tenant["id"], id: Vehicle["id"]): Promise<Vehicle> {
    const vehicle = await this.repository.findOneBy({
      id,
      tenantId,
    });
    if (!vehicle) {
      throw new NotFoundException("Vehicle not found");
    }

    return vehicle;
  }

  async update(
    tenantId: Tenant["id"],
    id: Vehicle["id"],
    updateVehicleDto: UpdateVehicleDto,
  ): Promise<Vehicle> {
    const vehicle = await this.findOne(tenantId, id);

    return this.repository.save({
      ...vehicle,
      ...updateVehicleDto,
    });
  }

  async remove(tenantId: Tenant["id"], id: Vehicle["id"]): Promise<void> {
    await this.findOne(tenantId, id);
    await this.repository.delete(id);
  }

  async findById(id: Vehicle["id"]): Promise<Vehicle | null> {
    return this.repository.findOneBy({ id });
  }
}
