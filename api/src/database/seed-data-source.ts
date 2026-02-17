import { DataSource } from "typeorm";
import { join } from "node:path";
import { config } from "dotenv";
import { ConfigService } from "@nestjs/config";
import {
  EnvironmentVariables,
  validate,
  validateNodeEnv,
} from "src/config/envs";

const env = validateNodeEnv();

config({
  path: join(__dirname, "..", "..", `.env.${env}`),
});

validate(process.env);

const service = new ConfigService<EnvironmentVariables>();

export default new DataSource({
  type: "postgres",
  host: service.get("DATABASE_HOST"),
  port: +service.get("DATABASE_PORT"),
  username: service.get("DATABASE_USERNAME"),
  password: service.get("DATABASE_PASSWORD"),
  database: service.get("DATABASE_NAME"),
  synchronize: false,
  entities: ["src/modules/**/entities/*.entity.ts"],
  migrations: [join(__dirname, "seeders", "*.ts")],
  migrationsRun: false,
  logging: true,
});
