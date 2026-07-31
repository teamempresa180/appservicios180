import { CategorySpecialization } from '../entities/category-specialization.entity';
import { CategoryId } from '../value-objects/category-id.value-object';
import { SpecializationId } from '../value-objects/specialization-id.value-object';

/**
 * Contract for CategorySpecialization persistence. No implementation
 * lives in this module — concrete repositories belong to the
 * infrastructure layer (`PrismaCategorySpecializationRepository`).
 */
/** DI token — interfaces have no runtime value in TS, so NestJS needs
 *  this to inject a `CategorySpecializationRepository` implementation
 *  by contract instead of by concrete class. */
export const CATEGORY_SPECIALIZATION_REPOSITORY = Symbol(
  'CategorySpecializationRepository',
);

export interface CategorySpecializationRepository {
  findById(id: SpecializationId): Promise<CategorySpecialization | null>;
  /** All Specializations belonging to a Category — what `GET
   *  /categories/:categoryId/specializations` and the Provider
   *  registration flow's category->specialization picker use. */
  findByCategoryId(categoryId: CategoryId): Promise<CategorySpecialization[]>;
}
