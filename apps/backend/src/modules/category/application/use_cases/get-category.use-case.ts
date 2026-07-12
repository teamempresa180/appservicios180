import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { CategoryRepository } from '../../domain/interfaces/category-repository.interface';
import { CategoryId } from '../../domain/value-objects/category-id.value-object';
import { GetCategoryQuery } from '../queries/get-category.query';
import { CategoryDto } from '../dto/category.dto';
import { CategoryMapper } from '../mappers/category.mapper';

/**
 * Fetches a single Category by id. Throws `NotFoundException` instead
 * of returning `null` — same pattern as `GetIdentityUseCase`.
 */
export class GetCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(query: GetCategoryQuery): Promise<CategoryDto> {
    const category = await this.categoryRepository.findById(
      CategoryId.fromString(query.id),
    );
    if (!category) {
      throw new NotFoundException(`Category ${query.id} not found`);
    }
    return CategoryMapper.toDto(category);
  }
}
