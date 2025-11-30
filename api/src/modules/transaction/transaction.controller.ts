import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { Permissions } from "src/common/permissions/permissions.decorator";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
// import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { TransactionService } from "./transaction.service";
import { GetAuth } from "../auth/auth.decorator";
import { AuthData } from "../auth/auth.interface";
import { UUIDParamPipe } from "src/common/pipes/uuid-param.pipe";
import { Transaction } from "./entities/transaction.entity";

@Controller("transactions")
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Permissions("TRANSACTION", "CREATE")
  @Post()
  create(
    @GetAuth() auth: AuthData,
    @Body()
    dto: CreateTransactionDto,
  ) {
    return this.transactionService.create(auth.tenantId!, auth.userId!, dto);
  }

  @Permissions("TRANSACTION", "READ")
  @Get(":id")
  findOne(
    @GetAuth() auth: AuthData,
    @Param("id", UUIDParamPipe) id: Transaction["id"],
  ) {
    return this.transactionService.findOne(auth.tenantId!, id);
  }

  // @Patch(":id")
  // update(
  //   @Param("id") id: string,
  //   @Body() updateTransactionDto: UpdateTransactionDto,
  // ) {
  //   return this.transactionService.update(+id, updateTransactionDto);
  // }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions("TRANSACTION", "DELETE")
  @Delete(":id")
  remove(
    @GetAuth() auth: AuthData,
    @Param("id", UUIDParamPipe) id: Transaction["id"],
  ) {
    return this.transactionService.remove(auth.tenantId!, id);
  }
}
