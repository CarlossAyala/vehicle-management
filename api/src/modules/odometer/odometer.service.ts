import { InjectRepository } from "@nestjs/typeorm";
import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Tenant } from "../tenants/entities/tenant.entity";
import { User } from "../user/entities/user.entity";
import { Operation } from "../operation/entities/operation.entity";
import { OperationService } from "../operation/operation.service";
import { OperationType } from "../operation/operation.interface";
import { Odometer } from "./entities/odometer.entity";
import { CreateOdometerDto } from "./dto/create-odometer.dto";
import { UpdateOdometerDto } from "./dto/update-odometer.dto";
import { Pagination } from "src/common/pagination/pagination.interface";
import { OdometerFiltersDto } from "./dto/odometer-filters.dto";
import { PaginationService } from "src/common/pagination/pagination.service";

@Injectable()
export class OdometerService {
  constructor(
    @InjectRepository(Odometer)
    private readonly repository: Repository<Odometer>,
    private readonly dataSource: DataSource,
    @Inject(forwardRef(() => OperationService))
    private readonly operationService: OperationService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(
    {
      tenantId,
      userId,
    }: {
      tenantId: Tenant["id"];
      userId: User["id"];
    },
    dto: CreateOdometerDto,
  ): Promise<{
    operation: Operation;
    odometer: Odometer;
  }> {
    const result = await this.dataSource.transaction(async (manager) => {
      const { operation, odometer } = await this.operationService.create(
        manager,
        {
          tenantId,
          userId,
          type: OperationType.ODOMETER,
          ...dto,
        },
      );

      return { operation, odometer: odometer! };
    });

    return result;
  }

  async findAll(
    tenantId: Tenant["id"],
    filters: OdometerFiltersDto,
  ): Promise<Pagination<Odometer>> {
    const qb = this.dataSource.manager
      .createQueryBuilder(Odometer, "odometer")
      .innerJoin("odometer.operation", "operation")
      .where("operation.tenantId = :tenantId", { tenantId })
      .orderBy("odometer.createdAt", "DESC");

    return this.paginationService.paginate(qb, filters);
  }

  async stats(tenantId: Tenant["id"]): Promise<{ total: number }> {
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
      .createQueryBuilder(Odometer, "odometer")
      .leftJoin("odometer.operation", "operation")
      .select(["SUM(odometer.value) as total"])
      .where("operation.tenantId = :tenantId", { tenantId })
      .andWhere("operation.createdAt BETWEEN :start AND :end", {
        start,
        end,
      })
      .getRawOne()) as {
      total: string;
    };

    return { total: parseInt(result.total, 10) || 0 };
  }

  async findByOperation(
    tenantId: Tenant["id"],
    id: Operation["id"],
  ): Promise<Odometer | null> {
    await this.operationService.checkOwnership(tenantId, id);

    const odometer = await this.getByOperationId(id);

    return odometer;
  }

  async findOne(tenantId: Tenant["id"], id: Odometer["id"]): Promise<Odometer> {
    const { odometer } = await this.checkOwnership(tenantId, id);

    return odometer;
  }

  async update(
    tenantId: Tenant["id"],
    id: Odometer["id"],
    dto: UpdateOdometerDto,
  ): Promise<{
    operation: Operation;
    odometer: Odometer;
  }> {
    const { operation: _operation, odometer: _odometer } =
      await this.checkOwnership(tenantId, id);

    const result = await this.dataSource.transaction(async (manager) => {
      const { operation, odometer } = await this.operationService.update(
        manager,
        _operation,
        {
          tenantId,
          type: OperationType.ODOMETER,
          ...dto,
        },
      );

      return { operation, odometer: odometer! };
    });

    return result;
  }

  async remove(
    tenantId: Tenant["id"],
    id: Odometer["id"],
  ): Promise<{
    operationId: Operation["id"];
    id: Odometer["id"];
  }> {
    const { operation } = await this.checkOwnership(tenantId, id);

    await this.operationService.remove(operation.id);

    return {
      operationId: operation.id,
      id,
    };
  }

  async getById(id: Odometer["id"]): Promise<Odometer | null> {
    return this.repository.findOneBy({ id });
  }

  async getByOperationId(
    operationId: Odometer["operationId"],
  ): Promise<Odometer | null> {
    return this.repository.findOneBy({ operationId });
  }

  async checkOwnership(
    tenantId: Tenant["id"],
    id: Odometer["id"],
  ): Promise<{
    operation: Operation;
    odometer: Odometer;
  }> {
    const odometer = await this.repository.findOneBy({ id });
    if (!odometer) {
      throw new NotFoundException("Odometer not found");
    }
    const operation = await this.operationService.getById(odometer.operationId);
    if (!operation || operation.tenantId !== tenantId) {
      throw new NotFoundException("Odometer not found");
    }

    return { operation, odometer };
  }
}
