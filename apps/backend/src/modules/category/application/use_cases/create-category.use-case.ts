import { Category } from '../../domain/entities/category.entity';
import { CategoryRepository } from '../../domain/interfaces/category-repository.interface';
import { CategoryId } from '../../domain/value-objects/category-id.value-object';
import { CategoryStatus } from '../../domain/value-objects/category-status.value-object';
import { CreateCategoryCommand } from '../commands/create-category.command';
import { CategoryDto } from '../dto/category.dto';
import { CategoryMapper } from '../mappers/category.mapper';
import { CategoryValidator } from '../validators/category.validator';

/**
 * Creates a new Category, always in `Active` status. No existence
 * check against another repository — `Category` is a standalone
 * catalog entity, unlike every module in Identity & Access/Profiles &
 * Contact/Trust & Compliance, which reference `IdentityId`.
 */
export class CreateCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(command: CreateCategoryCommand): Promise<CategoryDto> {
    CategoryValidator.validateCreate(command);

    const now = new Date();
    const category = new Category(CategoryId.create(), {
      name: command.name,
      description: command.description,
      icon: command.icon,
      color: command.color,
      status: CategoryStatus.Active,
      type: command.type,
      createdAt: now,
      updatedAt: now,
    });

    await this.categoryRepository.save(category);
    return CategoryMapper.toDto(category);
  }
}
