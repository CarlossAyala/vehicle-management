import { OmitType, PartialType } from "@nestjs/mapped-types";
import { CreateFuelDto } from "./create-fuel.dto";

export class UpdateFuelDto extends PartialType(
  OmitType(CreateFuelDto, ["vehicleId"] as const),
) {}
