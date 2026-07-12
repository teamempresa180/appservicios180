import { PaginatedResult } from '../../../core/application/paginated-result';
import { CategoryRepository } from '../../domain/interfaces/category-repository.interface';
import { ListCategoryQuery } from '../queries/list-category.query';
import { CategoryDto } from '../dto/category.dto';
import { CategoryMapper } from '../mappers/category.mapper';

/** Lists Categories page by page. */
export class ListCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(
    query: ListCategoryQuery,
  ): Promise<PaginatedResult<CategoryDto>> {
    const result = await this.categoryRepository.list(
      query.page,
      query.pageSize,
    );
    return {
      items: result.items.map((category) => CategoryMapper.toDto(category)),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  }
}
