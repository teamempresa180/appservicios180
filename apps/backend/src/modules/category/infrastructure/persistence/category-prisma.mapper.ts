import { CategoryModel as PrismaCategory } from '@prisma/client';
import { Category } from '../../domain/entities/category.entity';
import { CategoryId } from '../../domain/value-objects/category-id.value-object';
import { CategoryStatus } from '../../domain/value-objects/category-status.value-object';
import { CategoryType } from '../../domain/value-objects/category-type.value-object';

/**
 * Translates between the `Category` domain entity and its Prisma row
 * shape (`CategoryModel`, mapped to the `categories` table). The only
 * place in this module that imports from `@prisma/client` — Domain/
 * Application never do.
 */
export class CategoryPrismaMapper {
  static toDomain(row: PrismaCategory): Category {
    return new Category(CategoryId.fromString(row.id), {
      name: row.name,
      description: row.description,
      icon: row.icon,
      color: row.color,
      status: row.status as unknown as CategoryStatus,
      type: row.type as unknown as CategoryType,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static toPersistence(category: Category): PrismaCategory {
    return {
      id: category.id.value,
      name: category.name,
      description: category.description,
      icon: category.icon,
      color: category.color,
      status: category.status,
      type: category.type,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}
