import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { MAX_UNPAGINATED_RESULTS } from '../../../core/infrastructure/enum-search';
import { CategorySpecialization } from '../../domain/entities/category-specialization.entity';
import { CategorySpecializationRepository } from '../../domain/interfaces/category-specialization-repository.interface';
import { CategoryId } from '../../domain/value-objects/category-id.value-object';
import { SpecializationId } from '../../domain/value-objects/specialization-id.value-object';
import { CategorySpecializationPrismaMapper } from './category-specialization-prisma.mapper';

/**
 * `CategorySpecializationRepository` implementation backed by Prisma —
 * the only place in this module that knows Prisma exists. Read-only:
 * Specializations are seeded catalog data (8 Categories x 4-6 real
 * Specializations each), not managed through this API yet.
 */
@Injectable()
export class PrismaCategorySpecializationRepository
  implements CategorySpecializationRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: SpecializationId): Promise<CategorySpecialization | null> {
    const row = await this.prisma.categorySpecializationModel.findUnique({
      where: { id: id.value },
    });
    return row ? CategorySpecializationPrismaMapper.toDomain(row) : null;
  }

  async findByCategoryId(
    categoryId: CategoryId,
  ): Promise<CategorySpecialization[]> {
    const rows = await this.prisma.categorySpecializationModel.findMany({
      where: { categoryId: categoryId.value },
      orderBy: { name: 'asc' },
      take: MAX_UNPAGINATED_RESULTS,
    });
    return rows.map((row) => CategorySpecializationPrismaMapper.toDomain(row));
  }
}
