import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { CategoryRepository } from '../../domain/interfaces/category-repository.interface';
import { CategorySpecializationRepository } from '../../domain/interfaces/category-specialization-repository.interface';
import { CategoryId } from '../../domain/value-objects/category-id.value-object';
import { ListCategorySpecializationsQuery } from '../queries/list-category-specializations.query';
import { CategorySpecializationDto } from '../dto/category-specialization.dto';
import { CategorySpecializationMapper } from '../mappers/category-specialization.mapper';

/**
 * Lists the real Specializations that belong to a Category (e.g.
 * Electricidad -> Residencial/Comercial/Industrial/Domótica/Redes/
 * Paneles solares) — powers `GET /categories/:categoryId/specializations`
 * and the professional Provider registration flow's category ->
 * specialization picker. Verifies the Category itself exists first,
 * same criterion as `CreateProviderUseCase`'s Category check.
 */
export class ListCategorySpecializationsUseCase {
  constructor(
    private readonly specializationRepository: CategorySpecializationRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(
    query: ListCategorySpecializationsQuery,
  ): Promise<CategorySpecializationDto[]> {
    if (!query.categoryId?.trim()) {
      throw new ValidationException('categoryId is required');
    }

    const categoryId = CategoryId.fromString(query.categoryId);
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new NotFoundException(`Category ${query.categoryId} not found`);
    }

    const specializations =
      await this.specializationRepository.findByCategoryId(categoryId);
    return specializations.map((specialization) =>
      CategorySpecializationMapper.toDto(specialization),
    );
  }
}
