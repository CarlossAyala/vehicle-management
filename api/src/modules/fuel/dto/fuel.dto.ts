import { IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { Category } from "src/modules/category/entities/category.entity";

export class FuelDto {
  @IsNumber()
  quantity: number;

  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  categoryId: Category["id"];
}
