import { OmitType } from "@nestjs/mapped-types";
import { CreateOdometerDto } from "./create-odometer.dto";

export class UpdateOdometerDto extends OmitType(CreateOdometerDto, [
  "vehicleId",
] as const) {}
