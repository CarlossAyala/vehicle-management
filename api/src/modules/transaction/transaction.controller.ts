import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Patch,
} from "@nestjs/common";
import { Permissions } from "src/common/permissions/permissions.decorator";
import { UUIDParamPipe } from "src/common/pipes/uuid-param.pipe";
import { GetAuth } from "../auth/auth.decorator";
import { AuthData } from "../auth/auth.interface";
import { Transaction } from "./entities/transaction.entity";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { TransactionFiltersDto } from "./dto/transaction-filters.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { TransactionService } from "./transaction.service";

@Controller("transactions")
export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  @Permissions("TRANSACTION", "CREATE")
  @Post()
  create(
    @GetAuth() auth: AuthData,
    @Body()
    dto: CreateTransactionDto,
  ) {
    return this.service.create(auth.tenantId!, auth.userId!, dto);
  }

  @Permissions("TRANSACTION", "READ")
  @Get()
  findAll(@GetAuth() auth: AuthData, @Query() filters: TransactionFiltersDto) {
    return this.service.findAll(auth.tenantId!, filters);
  }

  @Permissions("TRANSACTION", "READ")
  @Get(":id")
  findOne(
    @GetAuth() auth: AuthData,
    @Param("id", UUIDParamPipe) id: Transaction["id"],
  ) {
    return this.service.findOne(auth.tenantId!, id);
  }

  @Permissions("TRANSACTION", "UPDATE")
  @Patch(":id")
  update(
    @GetAuth() auth: AuthData,
    @Param("id", UUIDParamPipe) id: Transaction["id"],
    @Body() dto: UpdateTransactionDto,
  ) {
    return this.service.update(auth.tenantId!, id, dto);
  }

  @Permissions("TRANSACTION", "DELETE")
  @Delete(":id")
  remove(
    @GetAuth() auth: AuthData,
    @Param("id", UUIDParamPipe) id: Transaction["id"],
  ) {
    return this.service.remove(auth.tenantId!, id);
  }
}
