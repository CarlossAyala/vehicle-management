import { plainToInstance } from "class-transformer";
import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsPort,
  IsString,
  validateSync,
} from "class-validator";

export enum NODE_ENV {
  PRODUCTION = "production",
  DEVELOPMENT = "development",
}

export class EnvironmentVariables {
  @IsEnum(NODE_ENV)
  NODE_ENV: NODE_ENV;

  @IsPort()
  NODE_PORT: string;

  @IsNotEmpty()
  @IsString()
  DATABASE_HOST: string;

  @IsPort()
  DATABASE_PORT: string;

  @IsNotEmpty()
  @IsString()
  DATABASE_USERNAME: string;

  @IsNotEmpty()
  @IsString()
  DATABASE_PASSWORD: string;

  @IsNotEmpty()
  @IsString()
  DATABASE_NAME: string;

  @IsNumberString()
  BCRYPT_SALT_ROUNDS: string;
}

export const validateNodeEnv = (): NODE_ENV => {
  const envs: NODE_ENV[] = [NODE_ENV.PRODUCTION, NODE_ENV.DEVELOPMENT];
  const env = process.env.NODE_ENV as NODE_ENV;

  if (!envs.includes(env)) {
    throw new Error(
      `NODE_ENV ${env} is not valid. Valid values are: ${envs.join(", ")}`,
    );
  }

  return env;
};

export const validate = (envs: Record<string, unknown>) => {
  const values = plainToInstance(EnvironmentVariables, envs, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(values, {
    skipMissingProperties: false,
    whitelist: true,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return values;
};
