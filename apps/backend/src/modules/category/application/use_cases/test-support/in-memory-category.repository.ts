import { PaginatedResult } from '../../../../core/application/paginated-result';
import { Category } from '../../../domain/entities/category.entity';
import { CategoryRepository } from '../../../domain/interfaces/category-repository.interface';
import { CategoryId } from '../../../domain/value-objects/category-id.value-object';

/** In-memory `CategoryRepository` fake — see `InMemoryIdentityRepository`. */
export class InMemoryCategoryRepository implements CategoryRepository {
  private readonly rows = new Map<string, Category>();

  findById(id: CategoryId): Promise<Category | null> {
    return Promise.resolve(this.rows.get(id.value) ?? null);
  }

  findAll(): Promise<Category[]> {
    return Promise.resolve([...this.rows.values()]);
  }

  save(category: Category): Promise<void> {
    this.rows.set(category.id.value, category);
    return Promise.resolve();
  }

  delete(id: CategoryId): Promise<void> {
    this.rows.delete(id.value);
    return Promise.resolve();
  }

  list(page: number, pageSize: number): Promise<PaginatedResult<Category>> {
    const all = [...this.rows.values()];
    const start = (page - 1) * pageSize;
    return Promise.resolve({
      items: all.slice(start, start + pageSize),
      total: all.length,
      page,
      pageSize,
    });
  }

  search(term: string): Promise<Category[]> {
    const lower = term.toLowerCase();
    return Promise.resolve(
      [...this.rows.values()].filter(
        (row) =>
          row.name.toLowerCase().includes(lower) ||
          row.description.toLowerCase().includes(lower),
      ),
    );
  }
}
