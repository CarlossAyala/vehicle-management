import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, EntityManager, Repository } from "typeorm";
import { PaginationService } from "src/common/pagination/pagination.service";
import { Pagination } from "src/common/pagination/pagination.interface";
import { User } from "../user/entities/user.entity";
import { Tenant } from "../tenants/entities/tenant.entity";
import { Category } from "../category/entities/category.entity";
import { CategoryService } from "../category/category.service";
import { Vehicle } from "../vehicle/entities/vehicle.entity";
import { VehicleService } from "../vehicle/vehicle.service";
import { Odometer } from "../odometer/entities/odometer.entity";
import { OdometerService } from "../odometer/odometer.service";
import { Operation } from "./entities/operation.entity";
import { CreateOperationDto } from "./dto/create-operation.dto";
import { UpdateOperationDto } from "./dto/update-operation.dto";
import { OperationFiltersDto } from "./dto/operation-filters.dto";
import { OperationType } from "./operation.interface";
import { Fuel } from "../fuel/entities/fuel.entity";

@Injectable()
export class OperationService {
  constructor(
    @InjectRepository(Operation)
    private readonly repository: Repository<Operation>,
    private readonly dataSource: DataSource,
    private readonly categoryService: CategoryService,
    private readonly vehicleService: VehicleService,
    @Inject(forwardRef(() => OdometerService))
    private readonly odometerService: OdometerService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(
    manager: EntityManager,
    {
      tenantId,
      userId: authorId,
      vehicleId,
      categoryId = undefined,
      categoryIds = [],
      type,
      odometer: odometerDto,
    }: {
      tenantId: Tenant["id"];
      userId: User["id"];
      categoryId?: Category["id"];
      categoryIds?: Category["id"][];
      type: OperationType;
    } & CreateOperationDto,
  ): Promise<{
    operation: Operation;
    odometer?: Odometer;
  }> {
    await this.checkCategory(
      tenantId,
      categoryId ? [categoryId] : categoryIds,
      type,
    );
    await this.checkVehicle(tenantId, vehicleId);

    const _operation = manager.create(Operation, {
      type,
      tenantId,
      vehicleId,
      authorId,
    });

    const operation = await manager.save(_operation);
    if (odometerDto) {
      const _odometer = manager.create(Odometer, {
        operationId: operation.id,
        ...odometerDto,
      });
      const odometer = await manager.save(_odometer);

      return { operation, odometer };
    } else {
      return { operation };
    }
  }

  async findAll(
    tenantId: Tenant["id"],
    filters: OperationFiltersDto,
  ): Promise<Pagination<Operation>> {
    const alias = "operation" as const;

    const qb = this.dataSource.manager
      .createQueryBuilder(Operation, alias)
      .where("operation.tenantId = :tenantId", { tenantId })
      .orderBy(alias + "." + filters.sort, filters.order);

    return this.paginationService.paginate(qb, filters);
  }

  async findOne(
    tenantId: Tenant["id"],
    id: Operation["id"],
  ): Promise<Operation> {
    const operation = await this.checkOwnership(tenantId, id);

    return operation;
  }

  async findEntity(
    tenantId: Tenant["id"],
    id: Operation["id"],
  ): Promise<{
    operation: Operation;
    entity: Odometer | Fuel;
  }> {
    const operation = await this.checkOwnership(tenantId, id);

    switch (operation.type) {
      case OperationType.FUEL: {
        const fuel = await this.dataSource
          .getRepository(Fuel)
          .findOneBy({ operationId: id });
        if (!fuel) {
          throw new NotFoundException("Fuel entity not found");
        }

        return { operation, entity: fuel };
      }
      case OperationType.ODOMETER: {
        const odometer = await this.dataSource
          .getRepository(Odometer)
          .findOneBy({ operationId: id });
        if (!odometer) {
          throw new NotFoundException("Odometer entity not found");
        }

        return { operation, entity: odometer };
      }

      default:
        throw new NotFoundException("Operation entity not found");
    }
  }

  async update(
    manager: EntityManager,
    operation: Operation,
    {
      tenantId,
      categoryId,
      categoryIds = [],
      type,
      odometer: odometerData,
    }: {
      tenantId: Tenant["id"];
      categoryId?: Category["id"];
      categoryIds?: Category["id"][];
      type: OperationType;
    } & UpdateOperationDto,
  ): Promise<{
    operation: Operation;
    odometer?: Odometer;
  }> {
    await this.checkCategory(
      tenantId,
      categoryId ? [categoryId] : categoryIds,
      type,
    );

    const result: {
      operation: Operation;
      odometer?: Odometer;
    } = { operation };

    const odometer = await this.odometerService.getByOperationId(operation.id);

    if (odometer) {
      if (odometerData) {
        Object.assign(odometer, odometerData);

        result.odometer = await manager.save(odometer);
      } else {
        await manager.remove(odometer);
      }
    } else {
      if (odometerData) {
        const _odometer = manager.create(Odometer, {
          value: odometerData.value,
          operationId: operation.id,
        });
        result.odometer = await manager.save(_odometer);
      }
    }
    return result;
  }

  async remove(id: Operation["id"]): Promise<void> {
    await this.repository.delete({ id });
  }

  async getById(id: Operation["id"]): Promise<Operation | null> {
    return this.repository.findOneBy({ id });
  }

  async getByIdOrFail(id: Operation["id"]): Promise<Operation> {
    const operation = await this.repository.findOneBy({ id });
    if (!operation) {
      throw new NotFoundException("Operation not found");
    }

    return operation;
  }

  async checkOwnership(
    tenantId: Tenant["id"],
    id: Operation["id"],
  ): Promise<Operation> {
    const operation = await this.getByIdOrFail(id);

    if (operation.tenantId !== tenantId) {
      throw new NotFoundException("Operation not found");
    }

    return operation;
  }

  async checkVehicle(
    tenantId: Tenant["id"],
    vehicleId: Vehicle["id"],
  ): Promise<void> {
    const vehicle = await this.vehicleService.findById(vehicleId);
    if (!vehicle || vehicle.tenantId !== tenantId) {
      throw new NotFoundException("Vehicle not found");
    }
  }

  async checkCategory(
    tenantId: Tenant["id"],
    categoryIds: Category["id"][],
    source: OperationType,
  ): Promise<void> {
    if (!categoryIds.length) return;

    const uniqueIdsA = new Set(categoryIds);

    const categories = await this.categoryService.findByIds([...uniqueIdsA]);

    const uniqueIdsB = new Set(categories.map((c) => c.id));

    // check if all categories belong to the tenant
    if (categories.some((c) => c.tenantId && c.tenantId !== tenantId)) {
      throw new NotFoundException("Some categories are not for this tenant");
    }

    // check if all categories were found
    if (uniqueIdsA.size !== uniqueIdsB.size) {
      throw new NotFoundException("Some categories were not found");
    }

    // check if all categories are for the correct operation type
    if (categories.some((c) => c.source !== source)) {
      throw new NotFoundException(
        "Some categories are not for this operation type",
      );
    }
  }
}
