import { PaginatedResult } from '../../../core/application/paginated-result';
import { CreateAvailabilityCommand } from '../../application/commands/create-availability.command';
import { UpdateAvailabilityCommand } from '../../application/commands/update-availability.command';
import { AvailabilityDto } from '../../application/dto/availability.dto';
import { CreateAvailabilityRequestDto } from './create-availability.request.dto';
import { UpdateAvailabilityRequestDto } from './update-availability.request.dto';
import { AvailabilityResponseDto } from './availability.response.dto';
import { AvailabilityListResponseDto } from './availability-list.response.dto';

/**
 * Translates between the HTTP-facing DTOs (this folder) and the
 * Application layer's commands/DTOs. The only place that knows both
 * shapes exist — `AvailabilityController` never builds a
 * `CreateAvailabilityCommand` or an `AvailabilityResponseDto` by
 * hand. `availableFrom`/`availableTo` are parsed here (ISO string →
 * `Date`); malformed input still reaches `AvailabilityValidator`,
 * which already rejects a non-`Date`/invalid `Date` — no validation
 * logic is duplicated here.
 */
export class AvailabilityHttpMapper {
  static toCreateCommand(
    dto: CreateAvailabilityRequestDto,
  ): CreateAvailabilityCommand {
    return new CreateAvailabilityCommand(
      dto.providerId,
      dto.type,
      new Date(dto.availableFrom),
      new Date(dto.availableTo),
    );
  }

  static toUpdateCommand(
    id: string,
    dto: UpdateAvailabilityRequestDto,
  ): UpdateAvailabilityCommand {
    return new UpdateAvailabilityCommand(
      id,
      dto.availableFrom !== undefined ? new Date(dto.availableFrom) : undefined,
      dto.availableTo !== undefined ? new Date(dto.availableTo) : undefined,
      dto.status,
    );
  }

  static toResponse(dto: AvailabilityDto): AvailabilityResponseDto {
    const response = new AvailabilityResponseDto();
    response.id = dto.id;
    response.providerId = dto.providerId;
    response.status = dto.status;
    response.type = dto.type;
    response.availableFrom = dto.availableFrom.toISOString();
    response.availableTo = dto.availableTo.toISOString();
    response.createdAt = dto.createdAt.toISOString();
    response.updatedAt = dto.updatedAt.toISOString();
    return response;
  }

  static toListResponse(
    result: PaginatedResult<AvailabilityDto>,
  ): AvailabilityListResponseDto {
    const response = new AvailabilityListResponseDto();
    response.items = result.items.map((item) =>
      AvailabilityHttpMapper.toResponse(item),
    );
    response.total = result.total;
    response.page = result.page;
    response.pageSize = result.pageSize;
    return response;
  }
}
