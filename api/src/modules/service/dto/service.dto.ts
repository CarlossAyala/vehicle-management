import { IsString } from "class-validator";

export class ServiceDto {
  @IsString()
  description: string = "";
}
