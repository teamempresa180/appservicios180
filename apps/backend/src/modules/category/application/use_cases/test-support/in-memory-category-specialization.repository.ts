import { CategorySpecialization } from '../../../domain/entities/category-specialization.entity';
import { CategorySpecializationRepository } from '../../../domain/interfaces/category-specialization-repository.interface';
import { CategoryId } from '../../../domain/value-objects/category-id.value-object';
import { SpecializationId } from '../../../domain/value-objects/specialization-id.value-object';

/**
 * In-memory `CategorySpecializationRepository` fake — see
 * `InMemoryCategoryRepository`.
 */
export class InMemoryCategorySpecializationRepository
  implements CategorySpecializationRepository
{
  private readonly rows = new Map<string, CategorySpecialization>();

  findById(id: SpecializationId): Promise<CategorySpecialization | null> {
    return Promise.resolve(this.rows.get(id.value) ?? null);
  }

  findByCategoryId(categoryId: CategoryId): Promise<CategorySpecialization[]> {
    return Promise.resolve(
      [...this.rows.values()].filter((row) =>
        row.categoryId.equals(categoryId),
      ),
    );
  }

  save(specialization: CategorySpecialization): Promise<void> {
    this.rows.set(specialization.id.value, specialization);
    return Promise.resolve();
  }
}
