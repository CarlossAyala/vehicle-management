import { IsNumber, IsString, IsUUID } from "class-validator";
import { Category } from "src/modules/category/entities/category.entity";

export class CreateServiceItemDto {
  @IsString()
  description: string;

  @IsNumber()
  amount: number;

  @IsUUID()
  categoryId: Category["id"];
}
