import { DataSource } from "typeorm";
import { join } from "node:path";

// TODO: get those values from environment variables
// https://medium.com/@ryanmambou/how-to-generate-and-run-a-migration-using-typeorm-in-nestjs-e0e078baf128

export default new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "carlos_ayala",
  password: "f1f86524b1f7a7869c6b1a19d1a15afd",
  database: "vehicle_management",
  synchronize: false,
  entities: ["src/modules/**/entities/*.entity.ts"],
  migrations: [join(__dirname, "migrations", "*.ts")],
  migrationsRun: false,
  logging: true,
});
