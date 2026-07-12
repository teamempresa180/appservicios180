import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { Category } from '../../domain/entities/category.entity';
import { CategoryRepository } from '../../domain/interfaces/category-repository.interface';
import { CategoryId } from '../../domain/value-objects/category-id.value-object';
import { UpdateCategoryCommand } from '../commands/update-category.command';
import { CategoryDto } from '../dto/category.dto';
import { CategoryMapper } from '../mappers/category.mapper';
import { CategoryValidator } from '../validators/category.validator';

/**
 * Updates the mutable fields of an existing Category (`name`,
 * `description`, `status`) — `icon`/`color`/`type` are not offered by
 * `UpdateCategoryCommand` (only by `UpdateCategoryDto`, unused by any
 * command), so they stay untouched, same criterion already applied to
 * `Profile.avatarUrl`/`Address.city`.
 */
export class UpdateCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(command: UpdateCategoryCommand): Promise<CategoryDto> {
    CategoryValidator.validateUpdate(command);

    const id = CategoryId.fromString(command.id);
    const existing = await this.categoryRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Category ${command.id} not found`);
    }

    const updated = new Category(existing.id, {
      name: command.name ?? existing.name,
      description: command.description ?? existing.description,
      icon: existing.icon,
      color: existing.color,
      status: command.status ?? existing.status,
      type: existing.type,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });

    await this.categoryRepository.save(updated);
    return CategoryMapper.toDto(updated);
  }
}
