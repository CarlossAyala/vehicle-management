import { Type } from "class-transformer";
import { IsObject, IsOptional, IsUUID, ValidateNested } from "class-validator";
import { OdometerDto } from "src/modules/odometer/dto/odometer.dto";
import { Vehicle } from "src/modules/vehicle/entities/vehicle.entity";

export class CreateOperationDto {
  @IsUUID()
  vehicleId: Vehicle["id"];

  @ValidateNested()
  @Type(() => OdometerDto)
  @IsObject()
  @IsOptional()
  odometer?: OdometerDto;
}
