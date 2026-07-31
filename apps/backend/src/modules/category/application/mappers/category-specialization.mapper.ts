import { CategorySpecialization } from '../../domain/entities/category-specialization.entity';
import { CategorySpecializationDto } from '../dto/category-specialization.dto';

/**
 * Translates between the CategorySpecialization domain entity and its
 * DTOs. Simple field-by-field mapping only — no business logic.
 */
export class CategorySpecializationMapper {
  static toDto(specialization: CategorySpecialization): CategorySpecializationDto {
    const dto = new CategorySpecializationDto();
    dto.id = specialization.id.value;
    dto.categoryId = specialization.categoryId.value;
    dto.name = specialization.name;
    dto.createdAt = specialization.createdAt;
    dto.updatedAt = specialization.updatedAt;
    return dto;
  }
}
