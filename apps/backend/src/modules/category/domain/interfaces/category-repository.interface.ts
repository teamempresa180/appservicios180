import { Category } from '../entities/category.entity';
import { CategoryId } from '../value-objects/category-id.value-object';

/**
 * Contract for Category persistence. No implementation lives in this
 * module — concrete repositories belong to the infrastructure layer, not yet built.
 */
export interface CategoryRepository {
  findById(id: CategoryId): Promise<Category | null>;
  findAll(): Promise<Category[]>;
  save(category: Category): Promise<void>;
}
