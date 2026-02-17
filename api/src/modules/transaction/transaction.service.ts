import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Pagination } from "src/common/pagination/pagination.interface";
import { PaginationService } from "src/common/pagination/pagination.service";
import { User } from "../user/entities/user.entity";
import { Tenant } from "../tenants/entities/tenant.entity";
import { OperationService } from "../operation/operation.service";
import { OperationType } from "../operation/operation.interface";
import { Operation } from "../operation/entities/operation.entity";
import { Odometer } from "../odometer/entities/odometer.entity";
import { Transaction } from "./entities/transaction.entity";
import { TransactionItem } from "./entities/transaction-item.entity";
import { TransactionFiltersDto } from "./dto/transaction-filters.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { TransactionType } from "./transaction.interface";

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly repository: Repository<Transaction>,
    @InjectRepository(TransactionItem)
    private readonly itemRepository: Repository<TransactionItem>,
    private readonly dataSource: DataSource,
    private readonly operationService: OperationService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(
    tenantId: Tenant["id"],
    userId: User["id"],
    {
      transaction: transactionDto,
      items: itemsDto,
      ...operationDto
    }: CreateTransactionDto,
  ): Promise<{
    operation: Operation;
    transaction: Transaction;
    items: TransactionItem[];
    odometer?: Odometer;
  }> {
    return this.dataSource.transaction(async (manager) => {
      const { operation, odometer } = await this.operationService.create(
        manager,
        {
          tenantId,
          userId,
          type:
            transactionDto.type === TransactionType.INCOME
              ? OperationType.INCOME
              : OperationType.EXPENSE,
          categoryIds: itemsDto.map((i) => i.categoryId),
          ...operationDto,
        },
      );
      const _transaction = manager.create(Transaction, {
        ...transactionDto,
        operationId: operation.id,
      });
      const transaction = await manager.save(_transaction);
      const _items = itemsDto.map((item) =>
        manager.create(TransactionItem, {
          ...item,
          transactionId: transaction.id,
        }),
      );
      const items = await manager.save(_items);

      return { operation, transaction, items, odometer };
    });
  }

  async findAll(
    tenantId: Tenant["id"],
    filters: TransactionFiltersDto,
  ): Promise<Pagination<Transaction & { items: TransactionItem[] }>> {
    const qb = this.dataSource.manager
      .createQueryBuilder(Transaction, "transaction")
      .leftJoinAndSelect("transaction.items", "items")
      .innerJoin("transaction.operation", "operation")
      .where("operation.tenantId = :tenantId", { tenantId })
      .orderBy("transaction.createdAt", "DESC");

    return this.paginationService.paginate(qb, filters);
  }

  async stats(tenantId: Tenant["id"]): Promise<{
    expense: number;
    income: number;
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
      .createQueryBuilder(Transaction, "transaction")
      .innerJoin("transaction.operation", "operation")
      .innerJoin("transaction.items", "item")
      .select([
        "SUM(CASE WHEN operation.type = 'expense' THEN item.amount ELSE 0 END) as expense",
        "SUM(CASE WHEN operation.type = 'income' THEN item.amount ELSE 0 END) as income",
      ])
      .where("operation.tenantId = :tenantId", { tenantId })
      .andWhere("transaction.createdAt BETWEEN :start AND :end", {
        start,
        end,
      })
      .getRawOne()) as {
      expense: string;
      income: string;
    };

    const expense = parseFloat(result.expense) || 0;
    const income = parseFloat(result.income) || 0;

    return {
      expense,
      income,
    };
  }

  async findOne(
    tenantId: Tenant["id"],
    id: Transaction["id"],
  ): Promise<Transaction & { items: TransactionItem[] }> {
    const { transaction } = await this.checkOwnership(tenantId, id);

    const items = await this.itemRepository.findBy({
      transactionId: transaction.id,
    });

    Object.assign(transaction, { items });

    return transaction;
  }

  async update(
    tenantId: Tenant["id"],
    id: Transaction["id"],
    {
      transaction: transactionDto,
      items: itemsDto,
      ...operationDto
    }: UpdateTransactionDto,
  ): Promise<{
    operation: Operation;
    transaction: Transaction;
    items: TransactionItem[];
    odometer?: Odometer;
  }> {
    const { operation: _operation, transaction: _transaction } =
      await this.checkOwnership(tenantId, id);

    const result = await this.dataSource.transaction(async (manager) => {
      const { operation, odometer } = await this.operationService.update(
        manager,
        _operation,
        {
          tenantId,
          type: [OperationType.INCOME, OperationType.EXPENSE],
          categoryIds: itemsDto.map((i) => i.categoryId),
          ...operationDto,
        },
      );

      const transaction = await manager.save(
        manager.create(Transaction, {
          ..._transaction,
          ...transactionDto,
        }),
      );

      const __items = await this.itemRepository.findBy({
        transactionId: id,
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
          TransactionItem,
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
        manager.create(TransactionItem, {
          ...item,
          transactionId: id,
        }),
      );
      const itemsToCreateResult = await manager.save(_itemsToCreate);

      return {
        operation,
        transaction,
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
    id: Transaction["id"],
  ): Promise<{
    operationId: Operation["id"];
    id: Transaction["id"];
    odometerId?: Odometer["id"];
  }> {
    const { operation, transaction } = await this.checkOwnership(tenantId, id);

    const odometer = await this.dataSource.getRepository(Odometer).findOneBy({
      operationId: operation.id,
    });

    await this.operationService.remove(operation.id);

    return {
      operationId: operation.id,
      id: transaction.id,
      odometerId: odometer?.id,
    };
  }

  async checkOwnership(
    tenantId: Tenant["id"],
    id: Transaction["id"],
  ): Promise<{
    operation: Operation;
    transaction: Transaction;
  }> {
    const transaction = await this.repository.findOneBy({ id });
    if (!transaction) {
      throw new NotFoundException("Transaction not found");
    }
    const operation = await this.operationService.getById(
      transaction.operationId,
    );
    if (!operation || operation.tenantId !== tenantId) {
      throw new NotFoundException("Transaction not found");
    }

    return { operation, transaction };
  }
}
