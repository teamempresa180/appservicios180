import { CategoryRepository } from '../../domain/interfaces/category-repository.interface';
import { CategoryDto } from '../dto/category.dto';
import { GetCategoryQuery } from '../queries/get-category.query';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class GetCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  execute(query: GetCategoryQuery): Promise<CategoryDto | null> {
    void this.categoryRepository;
    void query;
    throw new Error('Not implemented yet');
  }
}
