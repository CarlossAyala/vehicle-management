import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Pagination } from "src/common/pagination/pagination.interface";
import { PaginationService } from "src/common/pagination/pagination.service";
import { Operation } from "../operation/entities/operation.entity";
import { OperationType } from "../operation/operation.interface";
import { OperationService } from "../operation/operation.service";
import { Odometer } from "../odometer/entities/odometer.entity";
import { User } from "../user/entities/user.entity";
import { Tenant } from "../tenants/entities/tenant.entity";
import { OdometerService } from "../odometer/odometer.service";
import { Fuel } from "./entities/fuel.entity";
import { CreateFuelDto } from "./dto/create-fuel.dto";
import { UpdateFuelDto } from "./dto/update-fuel.dto";
import { FuelFiltersDto } from "./dto/fuel-filters.dto";

@Injectable()
export class FuelService {
  constructor(
    @InjectRepository(Fuel)
    private readonly repository: Repository<Fuel>,
    private readonly dataSource: DataSource,
    private readonly operationService: OperationService,
    private readonly odometerService: OdometerService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(
    { tenantId, userId }: { tenantId: Tenant["id"]; userId: User["id"] },
    dto: CreateFuelDto,
  ): Promise<{
    operation: Operation;
    fuel: Fuel;
    odometer?: Odometer;
  }> {
    const result = await this.dataSource.transaction(async (manager) => {
      const { operation, odometer } = await this.operationService.create(
        manager,
        {
          tenantId,
          userId,
          type: OperationType.FUEL,
          categoryId: dto.fuel.categoryId,
          ...dto,
        },
      );

      const _fuel = manager.create(Fuel, {
        ...dto.fuel,
        operationId: operation.id,
      });
      const fuel = await manager.save(_fuel);

      return { operation, fuel, odometer };
    });

    return result;
  }

  async findAll(
    tenantId: Tenant["id"],
    filters: FuelFiltersDto,
  ): Promise<Pagination<Fuel>> {
    const qb = this.dataSource.manager
      .createQueryBuilder(Fuel, "fuel")
      .leftJoin("fuel.operation", "operation")
      .where("operation.tenantId = :tenantId", { tenantId })
      .andWhere("operation.type = :type", {
        type: OperationType.FUEL,
      })
      .orderBy("fuel." + filters.sort, filters.order);

    return this.paginationService.paginate(qb, filters);
  }

  async findOne(tenantId: Tenant["id"], id: Fuel["id"]): Promise<Fuel> {
    const { fuel } = await this.checkOwnership(tenantId, id);

    return fuel;
  }

  async stats(tenantId: Tenant["id"]): Promise<{
    count: number;
    quantity: number;
    amount: number;
  }> {
    const now = new Date();
    // Start: First day of current month at 00:00:00.000
    const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    // End: Last day of current month at 23:59:59.999
    const end = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    const result = (await this.dataSource.manager
      .createQueryBuilder(Fuel, "fuel")
      .leftJoin("fuel.operation", "operation")
      .select([
        "COUNT(fuel.id) as count",
        "SUM(fuel.quantity) as quantity",
        "SUM(fuel.amount) as amount",
      ])
      .where("operation.tenantId = :tenantId", { tenantId })
      .andWhere("operation.type = :type", {
        type: OperationType.FUEL,
      })
      .andWhere("fuel.createdAt BETWEEN :start AND :end", {
        start,
        end,
      })
      .getRawOne()) as {
      count: string;
      quantity: string;
      amount: string;
    };

    return {
      count: parseInt(result.count, 10) || 0,
      quantity: parseFloat(result.quantity) || 0,
      amount: parseFloat(result.amount) || 0,
    };
  }

  async update(
    tenantId: Tenant["id"],
    id: Fuel["id"],
    { fuel: fuelDto, ...dto }: UpdateFuelDto,
  ): Promise<{
    operation: Operation;
    fuel: Fuel;
    odometer?: Odometer;
  }> {
    const { operation: _operation, fuel: _fuel } = await this.checkOwnership(
      tenantId,
      id,
    );

    const result = await this.dataSource.transaction(async (manager) => {
      const { operation, odometer } = await this.operationService.update(
        manager,
        _operation,
        {
          tenantId,
          type: OperationType.FUEL,
          categoryId: fuelDto?.categoryId,
          ...dto,
        },
      );
      Object.assign(_fuel, fuelDto);

      const fuel = await manager.save(_fuel);

      return { operation, fuel, odometer };
    });

    return result;
  }

  async remove(
    tenantId: Tenant["id"],
    id: Fuel["id"],
  ): Promise<{
    operationId: Operation["id"];
    id: Fuel["id"];
    odometerId?: Odometer["id"];
  }> {
    const { operation } = await this.checkOwnership(tenantId, id);

    const odometer = await this.odometerService.getByOperationId(operation.id);

    await this.operationService.remove(operation.id);

    return {
      operationId: operation.id,
      id,
      odometerId: odometer?.id,
    };
  }

  async checkOwnership(
    tenantId: Tenant["id"],
    id: Fuel["id"],
  ): Promise<{
    operation: Operation;
    fuel: Fuel;
  }> {
    const fuel = await this.repository.findOneBy({ id });
    if (!fuel) {
      throw new NotFoundException("Fuel not found");
    }
    const operation = await this.operationService.getById(fuel.operationId);
    if (!operation || operation.tenantId !== tenantId) {
      throw new NotFoundException("Fuel not found");
    }

    return { operation, fuel };
  }
}
