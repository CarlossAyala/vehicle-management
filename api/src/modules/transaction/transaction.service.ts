import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { User } from "../user/entities/user.entity";
import { Tenant } from "../tenants/entities/tenant.entity";
import { OperationService } from "../operation/operation.service";
import { OperationType } from "../operation/operation.interface";
// import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { Operation } from "../operation/entities/operation.entity";
import { Odometer } from "../odometer/entities/odometer.entity";
import { Transaction } from "./entities/transaction.entity";
import { TransactionItem } from "./entities/transaction-item.entity";
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
    const result = await this.dataSource.transaction(async (manager) => {
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

    return result;
  }

  async findOne(
    tenantId: Tenant["id"],
    id: Transaction["id"],
  ): Promise<{
    transaction: Transaction;
    items: TransactionItem[];
  }> {
    const { transaction } = await this.checkOwnership(tenantId, id);

    const items = await this.itemRepository.findBy({
      transactionId: transaction.id,
    });

    return { transaction, items };
  }

  async remove(tenantId: Tenant["id"], id: Transaction["id"]): Promise<void> {
    const { operation } = await this.checkOwnership(tenantId, id);

    await this.operationService.remove(operation.id);
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
