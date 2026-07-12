import { CategoryRepository } from '../../domain/interfaces/category-repository.interface';
import { SearchCategoryQuery } from '../queries/search-category.query';
import { CategoryDto } from '../dto/category.dto';
import { CategoryMapper } from '../mappers/category.mapper';

/**
 * Free-text search over `name`/`description`. This is the backend
 * capability that satisfies "Search" for the Marketplace bounded
 * context — there is no separate `Search` domain module (see
 * `PROJECT_STATUS.md`, section "Prompt 63", for the audit finding).
 */
export class SearchCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(query: SearchCategoryQuery): Promise<CategoryDto[]> {
    const results = await this.categoryRepository.search(query.term);
    return results.map((category) => CategoryMapper.toDto(category));
  }
}
