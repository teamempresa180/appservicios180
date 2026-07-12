import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { PaginatedResult } from '../../../core/application/paginated-result';
import { Category } from '../../domain/entities/category.entity';
import { CategoryRepository } from '../../domain/interfaces/category-repository.interface';
import { CategoryId } from '../../domain/value-objects/category-id.value-object';
import { CategoryPrismaMapper } from './category-prisma.mapper';

/**
 * `CategoryRepository` implementation backed by Prisma/PostgreSQL —
 * the only place in this module that knows Prisma exists. Domain and
 * Application depend only on `CategoryRepository` (the interface).
 */
@Injectable()
export class PrismaCategoryRepository implements CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: CategoryId): Promise<Category | null> {
    const row = await this.prisma.categoryModel.findUnique({
      where: { id: id.value },
    });
    return row ? CategoryPrismaMapper.toDomain(row) : null;
  }

  async findAll(): Promise<Category[]> {
    const rows = await this.prisma.categoryModel.findMany({
      orderBy: { name: 'asc' },
    });
    return rows.map((row) => CategoryPrismaMapper.toDomain(row));
  }

  async save(category: Category): Promise<void> {
    const data = CategoryPrismaMapper.toPersistence(category);
    await this.prisma.categoryModel.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async delete(id: CategoryId): Promise<void> {
    await this.prisma.categoryModel.delete({ where: { id: id.value } });
  }

  async list(
    page: number,
    pageSize: number,
  ): Promise<PaginatedResult<Category>> {
    const [rows, total] = await Promise.all([
      this.prisma.categoryModel.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { name: 'asc' },
      }),
      this.prisma.categoryModel.count(),
    ]);
    return {
      items: rows.map((row) => CategoryPrismaMapper.toDomain(row)),
      total,
      page,
      pageSize,
    };
  }

  async search(term: string): Promise<Category[]> {
    const rows = await this.prisma.categoryModel.findMany({
      where: {
        OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { description: { contains: term, mode: 'insensitive' } },
        ],
      },
      orderBy: { name: 'asc' },
    });
    return rows.map((row) => CategoryPrismaMapper.toDomain(row));
  }
}
