import { CategorySpecializationModel as PrismaCategorySpecialization } from '@prisma/client';
import { CategorySpecialization } from '../../domain/entities/category-specialization.entity';
import { CategoryId } from '../../domain/value-objects/category-id.value-object';
import { SpecializationId } from '../../domain/value-objects/specialization-id.value-object';

/**
 * Translates between the `CategorySpecialization` domain entity and
 * its Prisma row shape (`CategorySpecializationModel`, mapped to the
 * `category_specializations` table). The only place in this module
 * that imports from `@prisma/client` — Domain/Application never do.
 */
export class CategorySpecializationPrismaMapper {
  static toDomain(row: PrismaCategorySpecialization): CategorySpecialization {
    return new CategorySpecialization(SpecializationId.fromString(row.id), {
      categoryId: CategoryId.fromString(row.categoryId),
      name: row.name,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static toPersistence(
    specialization: CategorySpecialization,
  ): PrismaCategorySpecialization {
    return {
      id: specialization.id.value,
      categoryId: specialization.categoryId.value,
      name: specialization.name,
      createdAt: specialization.createdAt,
      updatedAt: specialization.updatedAt,
    };
  }
}
