import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { PaginationService } from "src/common/pagination/pagination.service";
import { Tenant } from "../tenants/entities/tenant.entity";
import { User } from "../user/entities/user.entity";
import { Operation } from "../operation/entities/operation.entity";
import { OperationType } from "../operation/operation.interface";
import { Odometer } from "../odometer/entities/odometer.entity";
import { OperationService } from "../operation/operation.service";
import { ServiceItem } from "./entities/service-item.entity";
import { Service } from "./entities/service.entity";
import { CreateServiceDto } from "./dto/create-service.dto";
import { UpdateServiceDto } from "./dto/update-service.dto";
import { ServiceFiltersDto } from "./dto/service-filters.dto";
import { Pagination } from "src/common/pagination/pagination.interface";

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private readonly repository: Repository<Service>,
    @InjectRepository(ServiceItem)
    private readonly itemRepository: Repository<ServiceItem>,
    private readonly dataSource: DataSource,
    private readonly operationService: OperationService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(
    tenantId: Tenant["id"],
    userId: User["id"],
    { items: itemsDto, service: serviceDto, ...operationDto }: CreateServiceDto,
  ): Promise<{
    operation: Operation;
    service: Service;
    items: ServiceItem[];
    odometer?: Odometer;
  }> {
    const result = await this.dataSource.transaction(async (manager) => {
      const { operation, odometer } = await this.operationService.create(
        manager,
        {
          tenantId,
          userId,
          type: OperationType.SERVICE,
          categoryIds: itemsDto.map((i) => i.categoryId),
          ...operationDto,
        },
      );

      const _service = manager.create(Service, {
        ...serviceDto,
        operationId: operation.id,
      });
      const service = await manager.save(_service);

      const _items = itemsDto.map((item) =>
        manager.create(ServiceItem, {
          ...item,
          serviceId: service.id,
        }),
      );
      const items = await manager.save(_items);

      return { operation, service, items, odometer };
    });

    return result;
  }

  async findAll(
    tenantId: Tenant["id"],
    filters: ServiceFiltersDto,
  ): Promise<Pagination<Service>> {
    const qb = this.dataSource.manager
      .createQueryBuilder(Service, "service")
      .leftJoinAndSelect("service.items", "items")
      .innerJoin("service.operation", "operation")
      .where("operation.tenantId = :tenantId", { tenantId })
      .orderBy("service.createdAt", "DESC");

    return this.paginationService.paginate(qb, filters);
  }

  async findOne(
    tenantId: Tenant["id"],
    id: Service["id"],
  ): Promise<
    Service & {
      items: ServiceItem[];
    }
  > {
    const { service } = await this.checkOwnership(tenantId, id);

    const items = await this.itemRepository.findBy({
      serviceId: service.id,
    });

    Object.assign(service, { items });

    return service;
  }

  async update(
    tenantId: Tenant["id"],
    id: Service["id"],
    { service: serviceDto, items: itemsDto, ...operationDto }: UpdateServiceDto,
  ): Promise<{
    operation: Operation;
    service: Service;
    items: ServiceItem[];
    odometer?: Odometer;
  }> {
    const { operation: _operation, service: _service } =
      await this.checkOwnership(tenantId, id);

    const result = await this.dataSource.transaction(async (manager) => {
      const { operation, odometer } = await this.operationService.update(
        manager,
        _operation,
        {
          tenantId,
          type: OperationType.SERVICE,
          categoryIds: itemsDto.map((i) => i.categoryId),
          ...operationDto,
        },
      );

      const service = await manager.save(
        manager.create(Service, {
          ..._service,
          ...serviceDto,
        }),
      );

      const __items = await this.itemRepository.findBy({
        serviceId: id,
      });

      const itemsWithId = itemsDto.filter((i) => i.id);
      const uniqueItems = new Set(itemsWithId.map((i) => i.id));
      if (uniqueItems.size !== itemsWithId.length) {
        throw new ConflictException("Duplicate items");
      }

      const itemsToRemove = __items.filter(
        (i) => !itemsDto.find((j) => j.id === i.id),
      );
      const itemsToUpdate = __items.filter((i) =>
        itemsDto.find((j) => j.id === i.id),
      );
      const itemsToCreate = itemsDto.filter((i) => !i.id);

      if (itemsToRemove.length) {
        await manager.delete(
          ServiceItem,
          itemsToRemove.map((i) => i.id),
        );
      }

      const _itemsToUpdate = itemsToUpdate.map((item) => {
        Object.assign(
          item,
          itemsDto.find((j) => j.id === item.id),
        );
        return item;
      });
      const itemsToUpdateResult = await manager.save(_itemsToUpdate);

      const _itemsToCreate = itemsToCreate.map((item) =>
        manager.create(ServiceItem, {
          ...item,
          serviceId: id,
        }),
      );
      const itemsToCreateResult = await manager.save(_itemsToCreate);

      return {
        operation,
        service,
        items: __items
          .filter((i) => itemsToRemove.find((j) => j.id !== i.id))
          .filter((i) => itemsToUpdate.find((j) => j.id === i.id))
          .concat(itemsToCreateResult)
          .concat(itemsToUpdateResult),
        odometer,
      };
    });

    return result;
  }

  async remove(
    tenantId: Tenant["id"],
    id: Service["id"],
  ): Promise<{
    operationId: Operation["id"];
    id: Service["id"];
    odometerId?: Odometer["id"];
  }> {
    const { operation, service } = await this.checkOwnership(tenantId, id);

    const odometer = await this.dataSource.getRepository(Odometer).findOneBy({
      operationId: operation.id,
    });

    await this.operationService.remove(operation.id);

    return {
      operationId: operation.id,
      id: service.id,
      odometerId: odometer?.id,
    };
  }

  async checkOwnership(
    tenantId: Tenant["id"],
    id: Service["id"],
  ): Promise<{
    operation: Operation;
    service: Service;
  }> {
    const service = await this.repository.findOneBy({ id });
    if (!service) {
      throw new NotFoundException("Service not found");
    }
    const operation = await this.operationService.getById(service.operationId);
    if (!operation || operation.tenantId !== tenantId) {
      throw new NotFoundException("Service not found");
    }

    return { operation, service };
  }
}
