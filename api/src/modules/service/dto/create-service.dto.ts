import { Type } from "class-transformer";
import {
  ArrayNotEmpty,
  IsArray,
  IsObject,
  ValidateNested,
} from "class-validator";
import { CreateOperationDto } from "src/modules/operation/dto/create-operation.dto";
import { IsArrayOfObjects } from "src/common/decorators/is-array-of-objects.decorator";
import { CreateServiceItemDto } from "./create-service-item.dto";
import { ServiceDto } from "./service.dto";

export class CreateServiceDto extends CreateOperationDto {
  @ValidateNested()
  @Type(() => ServiceDto)
  @IsObject()
  service: ServiceDto;

  @IsArrayOfObjects()
  @ArrayNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateServiceItemDto)
  items: CreateServiceItemDto[];
}
