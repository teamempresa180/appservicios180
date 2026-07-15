import { PaginatedResult } from '../../../core/application/paginated-result';
import { CreateCategoryCommand } from '../../application/commands/create-category.command';
import { UpdateCategoryCommand } from '../../application/commands/update-category.command';
import { CategoryDto } from '../../application/dto/category.dto';
import { CreateCategoryRequestDto } from './create-category.request.dto';
import { UpdateCategoryRequestDto } from './update-category.request.dto';
import { CategoryResponseDto } from './category.response.dto';
import { CategoryListResponseDto } from './category-list.response.dto';

/**
 * Translates between the HTTP-facing DTOs (this folder) and the
 * Application layer's commands/DTOs. The only place that knows both
 * shapes exist — `CategoryController` never builds a
 * `CreateCategoryCommand` or a `CategoryResponseDto` by hand.
 */
export class CategoryHttpMapper {
  static toCreateCommand(dto: CreateCategoryRequestDto): CreateCategoryCommand {
    return new CreateCategoryCommand(
      dto.name,
      dto.description,
      dto.icon,
      dto.color,
      dto.type,
    );
  }

  static toUpdateCommand(
    id: string,
    dto: UpdateCategoryRequestDto,
  ): UpdateCategoryCommand {
    return new UpdateCategoryCommand(id, dto.name, dto.description, dto.status);
  }

  static toResponse(dto: CategoryDto): CategoryResponseDto {
    const response = new CategoryResponseDto();
    response.id = dto.id;
    response.name = dto.name;
    response.description = dto.description;
    response.icon = dto.icon;
    response.color = dto.color;
    response.status = dto.status;
    response.type = dto.type;
    response.createdAt = dto.createdAt.toISOString();
    response.updatedAt = dto.updatedAt.toISOString();
    return response;
  }

  static toListResponse(
    result: PaginatedResult<CategoryDto>,
  ): CategoryListResponseDto {
    const response = new CategoryListResponseDto();
    response.items = result.items.map((item) =>
      CategoryHttpMapper.toResponse(item),
    );
    response.total = result.total;
    response.page = result.page;
    response.pageSize = result.pageSize;
    return response;
  }
}
