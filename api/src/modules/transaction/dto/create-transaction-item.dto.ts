import { IsNumber, IsString, IsUUID } from "class-validator";
import { Category } from "src/modules/category/entities/category.entity";

export class CreateTransactionItemDto {
  @IsNumber()
  amount: number;

  @IsString()
  description: string = "";

  @IsUUID()
  categoryId: Category["id"];
}
