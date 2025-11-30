import { MigrationInterface, QueryRunner } from "typeorm";
import { Category } from "src/modules/category/entities/category.entity";
import {
  OperationCategories,
  OperationType,
} from "src/modules/operation/operation.interface";

export class SystemCategories1759614177225 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const categories: Category[] = [];

    for (const [key, values] of Object.entries(OperationCategories)) {
      for (const value of values) {
        const category = new Category();
        category.name = value;
        category.source = key as OperationType;

        categories.push(category);
      }
    }
    await queryRunner.manager.save(categories);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete(Category, {
      tenantId: undefined,
    });
  }
}
