import { Injectable } from "@nestjs/common";
import {
  FindManyOptions,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from "typeorm";
import {
  Pagination,
  PaginationMeta,
  PaginationOptions,
} from "./pagination.interface";

@Injectable()
export class PaginationService {
  // Pagination using query builder
  async paginate<T extends ObjectLiteral>(
    qb: SelectQueryBuilder<T>,
    options: PaginationOptions,
  ): Promise<Pagination<T>> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const [data, count] = await qb.skip(skip).take(limit).getManyAndCount();

    const meta = this.getMeta(options, count);

    return {
      data,
      meta,
    };
  }

  async paginateRepository<T extends ObjectLiteral>(
    repository: Repository<T>,
    options: PaginationOptions,
    findOptions?: FindManyOptions<T>,
  ): Promise<Pagination<T>> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const [data, count] = await repository.findAndCount({
      ...findOptions,
      skip,
      take: limit,
    });

    const meta = this.getMeta(options, count);

    return {
      data,
      meta,
    };
  }

  getMeta({ page, limit }: PaginationOptions, count: number): PaginationMeta {
    const pages = Math.ceil(count / limit);

    const meta: PaginationMeta = {
      limit,
      count,
      pages: {
        first: 1,
        previous: page > 1 ? page - 1 : 1,
        hasPrevious: page > 1,
        current: page,
        next: page < pages ? page + 1 : 1,
        hasNext: page < pages,
        last: pages < 1 ? 1 : pages,
        total: pages < 1 ? 1 : pages,
      },
    };

    return meta;
  }
}
