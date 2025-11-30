import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from "@nestjs/common";
import { isUUID } from "class-validator";

@Injectable()
export class UUIDParamPipe implements PipeTransform<string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    const location = metadata.data
      ? `parameter "${metadata.data}" (${metadata.type})`
      : `type "${metadata.type}"`;

    if (!value) {
      throw new BadRequestException("Missing UUID in " + location);
    }

    if (!isUUID(value)) {
      throw new BadRequestException("Invalid UUID in " + location);
    }

    return value;
  }
}
