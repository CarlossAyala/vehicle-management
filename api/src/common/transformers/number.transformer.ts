import { ValueTransformer } from "typeorm";

export class DecimalTransformer implements ValueTransformer {
  // To db from typeorm
  to(value: number): number {
    return value;
  }
  // From db to typeorm
  from(value: string): number {
    return parseFloat(value);
  }
}
