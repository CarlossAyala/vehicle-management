import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OperationModule } from "../operation/operation.module";
import { Transaction } from "./entities/transaction.entity";
import { TransactionItem } from "./entities/transaction-item.entity";
import { TransactionController } from "./transaction.controller";
import { TransactionService } from "./transaction.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, TransactionItem]),
    OperationModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
