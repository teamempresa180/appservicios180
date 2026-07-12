import { PaginatedResult } from '../../../core/application/paginated-result';
import { Category } from '../entities/category.entity';
import { CategoryId } from '../value-objects/category-id.value-object';

/**
 * Contract for Category persistence. No implementation lives in this
 * module — concrete repositories belong to the infrastructure layer
 * (Sprint 3, Etapa 6: `PrismaCategoryRepository`).
 */
/** DI token — interfaces have no runtime value in TS, so NestJS needs
 *  this to inject a `CategoryRepository` implementation by contract
 *  instead of by concrete class. */
export const CATEGORY_REPOSITORY = Symbol('CategoryRepository');

export interface CategoryRepository {
  findById(id: CategoryId): Promise<Category | null>;
  findAll(): Promise<Category[]>;
  save(category: Category): Promise<void>;
  delete(id: CategoryId): Promise<void>;
  list(page: number, pageSize: number): Promise<PaginatedResult<Category>>;
  /** Free-text match against `name`/`description`. */
  search(term: string): Promise<Category[]>;
}
