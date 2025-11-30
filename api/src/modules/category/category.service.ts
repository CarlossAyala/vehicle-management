import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, IsNull, Repository } from "typeorm";
import { Tenant } from "../tenants/entities/tenant.entity";
import { Category } from "./entities/category.entity";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>,
  ) {}

  findById(id: Category["id"]): Promise<Category | null> {
    return this.repository.findOneBy({ id });
  }

  findByIds(ids: Category["id"][]): Promise<Category[]> {
    return this.repository.findBy({ id: In(ids) });
  }

  async create(
    tenantId: Tenant["id"],
    dto: CreateCategoryDto,
  ): Promise<Category> {
    const category = new Category();
    category.tenantId = tenantId;
    Object.assign(category, dto);

    return this.repository.save(category);
  }

  async findAll(tenantId: Tenant["id"]): Promise<Category[]> {
    return this.repository.find({
      where: [{ tenantId }, { tenantId: IsNull() }],
    });
  }

  async findOne(tenantId: Tenant["id"], id: Category["id"]): Promise<Category> {
    const category = await this.findById(id);
    if (!category || (category.tenantId && category.tenantId !== tenantId)) {
      throw new NotFoundException("Category not found");
    }

    return category;
  }

  async update(
    tenantId: Tenant["id"],
    id: Category["id"],
    dto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOne(tenantId, id);
    if (!category.tenantId) {
      throw new NotFoundException("System categories cannot be edited");
    }

    Object.assign(category, dto);

    return this.repository.save(category);
  }

  async remove(tenantId: Tenant["id"], id: Category["id"]): Promise<void> {
    const category = await this.findOne(tenantId, id);
    if (!category.tenantId) {
      throw new NotFoundException("System categories cannot be deleted");
    }

    await this.repository.remove(category);
  }
}
