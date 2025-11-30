import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpStatus,
  HttpCode,
} from "@nestjs/common";
import { Permissions } from "src/common/permissions/permissions.decorator";
import { GetAuth } from "../auth/auth.decorator";
import { AuthData } from "../auth/auth.interface";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { Category } from "./entities/category.entity";
import { CategoryService } from "./category.service";
import { UUIDParamPipe } from "src/common/pipes/uuid-param.pipe";

@Controller("categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Permissions("CATEGORIES", "CREATE")
  @Post()
  create(
    @GetAuth() auth: AuthData,
    @Body() dto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.create(auth.tenantId!, dto);
  }

  @Permissions("CATEGORIES", "READ")
  @Get()
  findAll(@GetAuth() auth: AuthData): Promise<Category[]> {
    return this.categoryService.findAll(auth.tenantId!);
  }

  @Permissions("CATEGORIES", "READ")
  @Get(":id")
  findOne(
    @GetAuth() auth: AuthData,
    @Param("id", UUIDParamPipe) id: Category["id"],
  ): Promise<Category> {
    return this.categoryService.findOne(auth.tenantId!, id);
  }

  @Permissions("CATEGORIES", "UPDATE")
  @Patch(":id")
  update(
    @GetAuth() auth: AuthData,
    @Param("id", ParseUUIDPipe) id: Category["id"],
    @Body() dto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.update(auth.tenantId!, id, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions("CATEGORIES", "DELETE")
  @Delete(":id")
  remove(
    @GetAuth() auth: AuthData,
    @Param("id", ParseUUIDPipe) id: Category["id"],
  ): Promise<void> {
    return this.categoryService.remove(auth.tenantId!, id);
  }
}
