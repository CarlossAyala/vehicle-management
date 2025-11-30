import { IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { Category } from "src/modules/category/entities/category.entity";
import { ServiceItem } from "../entities/service-item.entity";

export class UpdateServiceItemDto {
  @IsUUID()
  @IsOptional()
  id?: ServiceItem["id"];

  @IsString()
  description: string;

  @IsNumber()
  amount: number;

  @IsUUID()
  categoryId: Category["id"];
}
