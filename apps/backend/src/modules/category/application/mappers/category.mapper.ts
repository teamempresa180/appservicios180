import { Category } from '../../domain/entities/category.entity';
import { CategoryDto } from '../dto/category.dto';

/**
 * Translates between the Category domain entity and its DTOs.
 * Simple field-by-field mapping only — no business logic.
 */
export class CategoryMapper {
  static toDto(category: Category): CategoryDto {
    const dto = new CategoryDto();
    dto.id = category.id.value;
    dto.name = category.name;
    dto.description = category.description;
    dto.icon = category.icon;
    dto.color = category.color;
    dto.status = category.status;
    dto.type = category.type;
    dto.createdAt = category.createdAt;
    dto.updatedAt = category.updatedAt;
    return dto;
  }
}
