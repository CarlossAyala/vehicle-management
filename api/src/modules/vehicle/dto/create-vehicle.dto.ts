import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { VehicleStatus, VehicleType } from "../vehicle.interface";

export class CreateVehicleDto {
  @IsOptional()
  @IsString()
  nickname?: string;

  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsOptional()
  @IsString()
  variant?: string;

  @IsInt()
  year: number;

  @IsString()
  licensePlate: string;

  @IsEnum(VehicleType)
  type: VehicleType;

  @IsEnum(VehicleStatus)
  status: VehicleStatus;
}
