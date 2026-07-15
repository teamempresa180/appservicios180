import { PaginatedResult } from '../../../core/application/paginated-result';
import { CreateServiceCommand } from '../../application/commands/create-service.command';
import { UpdateServiceCommand } from '../../application/commands/update-service.command';
import { ServiceDto } from '../../application/dto/service.dto';
import { CreateServiceRequestDto } from './create-service.request.dto';
import { UpdateServiceRequestDto } from './update-service.request.dto';
import { ServiceResponseDto } from './service.response.dto';
import { ServiceListResponseDto } from './service-list.response.dto';

/**
 * Translates between the HTTP-facing DTOs (this folder) and the
 * Application layer's commands/DTOs. The only place that knows both
 * shapes exist — `ServiceController` never builds a
 * `CreateServiceCommand` or a `ServiceResponseDto` by hand.
 */
export class ServiceHttpMapper {
  static toCreateCommand(dto: CreateServiceRequestDto): CreateServiceCommand {
    return new CreateServiceCommand(
      dto.providerId,
      dto.categoryId,
      dto.name,
      dto.description,
      dto.basePrice,
      dto.estimatedDuration,
      dto.type,
    );
  }

  static toUpdateCommand(
    id: string,
    dto: UpdateServiceRequestDto,
  ): UpdateServiceCommand {
    return new UpdateServiceCommand(
      id,
      dto.basePrice,
      dto.estimatedDuration,
      dto.status,
    );
  }

  static toResponse(dto: ServiceDto): ServiceResponseDto {
    const response = new ServiceResponseDto();
    response.id = dto.id;
    response.providerId = dto.providerId;
    response.categoryId = dto.categoryId;
    response.name = dto.name;
    response.description = dto.description;
    response.basePrice = dto.basePrice;
    response.estimatedDuration = dto.estimatedDuration;
    response.status = dto.status;
    response.type = dto.type;
    response.createdAt = dto.createdAt.toISOString();
    response.updatedAt = dto.updatedAt.toISOString();
    return response;
  }

  static toListResponse(
    result: PaginatedResult<ServiceDto>,
  ): ServiceListResponseDto {
    const response = new ServiceListResponseDto();
    response.items = result.items.map((item) =>
      ServiceHttpMapper.toResponse(item),
    );
    response.total = result.total;
    response.page = result.page;
    response.pageSize = result.pageSize;
    return response;
  }
}
