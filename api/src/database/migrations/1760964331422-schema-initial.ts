import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaInitial1760964331422 implements MigrationInterface {
  name = "SchemaInitial1760964331422";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_tenant_role_enum" AS ENUM('owner', 'admin', 'fleet_manager', 'driver', 'viewer')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_tenant" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "public"."user_tenant_role_enum" NOT NULL, "userId" uuid NOT NULL, "tenantId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ae07d48a61ca20ab3586d397a71" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "session" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."invitation_role_enum" AS ENUM('owner', 'admin', 'fleet_manager', 'driver', 'viewer')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."invitation_status_enum" AS ENUM('pending', 'accepted', 'rejected')`,
    );
    await queryRunner.query(
      `CREATE TABLE "invitation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "token" character varying NOT NULL, "role" "public"."invitation_role_enum" NOT NULL, "status" "public"."invitation_status_enum" NOT NULL, "authorId" uuid NOT NULL, "tenantId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "expiredAt" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_beb994737756c0f18a1c1f8669c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_invitation_token" ON "invitation" ("token") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_invitation_email" ON "invitation" ("email") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_user_email" ON "user" ("email") `,
    );
    await queryRunner.query(
      `CREATE TABLE "odometer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" integer NOT NULL, "description" character varying NOT NULL DEFAULT '', "operationId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_0f3ee91d3c51db6a002e6929ce" UNIQUE ("operationId"), CONSTRAINT "PK_6fd12f4fa01aff3356d3b352c5c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "fuel" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" numeric(10,2) NOT NULL, "amount" numeric(10,2) NOT NULL, "description" character varying NOT NULL DEFAULT '', "operationId" uuid NOT NULL, "categoryId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_270c9661b09583488ef403e8fa" UNIQUE ("operationId"), CONSTRAINT "PK_0979c62883aa0364e3152b6d36a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" integer NOT NULL, "description" character varying NOT NULL, "transactionId" uuid NOT NULL, "categoryId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b40595241a69876722f692d041f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."transaction_type_enum" AS ENUM('expense', 'income')`,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."transaction_type_enum" NOT NULL, "description" character varying NOT NULL, "operationId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_263d41ad9ab8ab02e9d5911308" UNIQUE ("operationId"), CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."operation_type_enum" AS ENUM('fuel', 'odometer', 'service', 'transaction', 'expense', 'income', 'vehicle_lifecycle', 'driver_assignment', 'reminder', 'checklist', 'route')`,
    );
    await queryRunner.query(
      `CREATE TABLE "operation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."operation_type_enum" NOT NULL, "tenantId" uuid NOT NULL, "vehicleId" uuid NOT NULL, "authorId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_18556ee6e49c005fc108078f3ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "service" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying NOT NULL, "operationId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_2240cd2fb81c9f88abd00edab9" UNIQUE ("operationId"), CONSTRAINT "PK_85a21558c006647cd76fdce044b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "service_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying NOT NULL, "amount" integer NOT NULL, "serviceId" uuid NOT NULL, "categoryId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4b061659545d9cc5d7c1f4805fc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."category_source_enum" AS ENUM('fuel', 'odometer', 'service', 'transaction', 'expense', 'income', 'vehicle_lifecycle', 'driver_assignment', 'reminder', 'checklist', 'route')`,
    );
    await queryRunner.query(
      `CREATE TABLE "category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "source" "public"."category_source_enum" NOT NULL, "tenantId" uuid, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tenant_type_enum" AS ENUM('personal', 'fleet')`,
    );
    await queryRunner.query(
      `CREATE TABLE "tenant" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "type" "public"."tenant_type_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_da8c6efd67bb301e810e56ac139" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."vehicle_type_enum" AS ENUM('car', 'truck', 'motorcycle', 'van')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."vehicle_status_enum" AS ENUM('in_use', 'available', 'maintenance', 'inactive')`,
    );
    await queryRunner.query(
      `CREATE TABLE "vehicle" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nickname" character varying NOT NULL DEFAULT '', "brand" character varying NOT NULL, "model" character varying NOT NULL, "variant" character varying NOT NULL DEFAULT '', "year" integer NOT NULL, "licensePlate" character varying NOT NULL, "type" "public"."vehicle_type_enum" NOT NULL, "status" "public"."vehicle_status_enum" NOT NULL, "tenantId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_187fa17ba39d367e5604b3d1ec9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_tenant" ADD CONSTRAINT "FK_b8a35c97c3c39e18d9f913c8098" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_tenant" ADD CONSTRAINT "FK_438336c75d48db09e9c18b0cdf2" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitation" ADD CONSTRAINT "FK_604197cd8c5320f5da15993b83c" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitation" ADD CONSTRAINT "FK_0522f047b4139279d004c672ea1" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "odometer" ADD CONSTRAINT "FK_0f3ee91d3c51db6a002e6929ce0" FOREIGN KEY ("operationId") REFERENCES "operation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fuel" ADD CONSTRAINT "FK_270c9661b09583488ef403e8fae" FOREIGN KEY ("operationId") REFERENCES "operation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fuel" ADD CONSTRAINT "FK_b810c6c736d772ce5ec83b5bd8c" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_item" ADD CONSTRAINT "FK_2705caeb66a0fa4505f53f04e8f" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_item" ADD CONSTRAINT "FK_1f99113910b43c7b2326c0ce31e" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_263d41ad9ab8ab02e9d59113082" FOREIGN KEY ("operationId") REFERENCES "operation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operation" ADD CONSTRAINT "FK_ac1257bfe80d5cdd9c3fd2dece3" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operation" ADD CONSTRAINT "FK_289c58cdde3f9e5e7d1c9111b6f" FOREIGN KEY ("vehicleId") REFERENCES "vehicle"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operation" ADD CONSTRAINT "FK_710e023a12a046515d8fca7a2e3" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "service" ADD CONSTRAINT "FK_2240cd2fb81c9f88abd00edab96" FOREIGN KEY ("operationId") REFERENCES "operation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_item" ADD CONSTRAINT "FK_6404729b553f1e2616aff2a501b" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_item" ADD CONSTRAINT "FK_7b39c3641d80857832acfaf434d" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" ADD CONSTRAINT "FK_ecfa4b687173f2c9fe47b918c3c" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "vehicle" ADD CONSTRAINT "FK_92a65e381dca076a03c428ba15c" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "vehicle" DROP CONSTRAINT "FK_92a65e381dca076a03c428ba15c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" DROP CONSTRAINT "FK_ecfa4b687173f2c9fe47b918c3c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_item" DROP CONSTRAINT "FK_7b39c3641d80857832acfaf434d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_item" DROP CONSTRAINT "FK_6404729b553f1e2616aff2a501b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service" DROP CONSTRAINT "FK_2240cd2fb81c9f88abd00edab96"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operation" DROP CONSTRAINT "FK_710e023a12a046515d8fca7a2e3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operation" DROP CONSTRAINT "FK_289c58cdde3f9e5e7d1c9111b6f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operation" DROP CONSTRAINT "FK_ac1257bfe80d5cdd9c3fd2dece3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_263d41ad9ab8ab02e9d59113082"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_item" DROP CONSTRAINT "FK_1f99113910b43c7b2326c0ce31e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_item" DROP CONSTRAINT "FK_2705caeb66a0fa4505f53f04e8f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fuel" DROP CONSTRAINT "FK_b810c6c736d772ce5ec83b5bd8c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fuel" DROP CONSTRAINT "FK_270c9661b09583488ef403e8fae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "odometer" DROP CONSTRAINT "FK_0f3ee91d3c51db6a002e6929ce0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitation" DROP CONSTRAINT "FK_0522f047b4139279d004c672ea1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitation" DROP CONSTRAINT "FK_604197cd8c5320f5da15993b83c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_tenant" DROP CONSTRAINT "FK_438336c75d48db09e9c18b0cdf2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_tenant" DROP CONSTRAINT "FK_b8a35c97c3c39e18d9f913c8098"`,
    );
    await queryRunner.query(`DROP TABLE "vehicle"`);
    await queryRunner.query(`DROP TYPE "public"."vehicle_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."vehicle_type_enum"`);
    await queryRunner.query(`DROP TABLE "tenant"`);
    await queryRunner.query(`DROP TYPE "public"."tenant_type_enum"`);
    await queryRunner.query(`DROP TABLE "category"`);
    await queryRunner.query(`DROP TYPE "public"."category_source_enum"`);
    await queryRunner.query(`DROP TABLE "service_item"`);
    await queryRunner.query(`DROP TABLE "service"`);
    await queryRunner.query(`DROP TABLE "operation"`);
    await queryRunner.query(`DROP TYPE "public"."operation_type_enum"`);
    await queryRunner.query(`DROP TABLE "transaction"`);
    await queryRunner.query(`DROP TYPE "public"."transaction_type_enum"`);
    await queryRunner.query(`DROP TABLE "transaction_item"`);
    await queryRunner.query(`DROP TABLE "fuel"`);
    await queryRunner.query(`DROP TABLE "odometer"`);
    await queryRunner.query(`DROP INDEX "public"."idx_user_email"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP INDEX "public"."idx_invitation_email"`);
    await queryRunner.query(`DROP INDEX "public"."idx_invitation_token"`);
    await queryRunner.query(`DROP TABLE "invitation"`);
    await queryRunner.query(`DROP TYPE "public"."invitation_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."invitation_role_enum"`);
    await queryRunner.query(`DROP TABLE "session"`);
    await queryRunner.query(`DROP TABLE "user_tenant"`);
    await queryRunner.query(`DROP TYPE "public"."user_tenant_role_enum"`);
  }
}
