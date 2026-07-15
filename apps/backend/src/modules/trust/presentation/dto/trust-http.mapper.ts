import { PaginatedResult } from '../../../core/application/paginated-result';
import { CreateTrustProfileCommand } from '../../application/commands/create-trust-profile.command';
import { UpdateTrustProfileCommand } from '../../application/commands/update-trust-profile.command';
import { TrustDto } from '../../application/dto/trust.dto';
import { CreateTrustProfileRequestDto } from './create-trust-profile.request.dto';
import { UpdateTrustProfileRequestDto } from './update-trust-profile.request.dto';
import { TrustResponseDto } from './trust.response.dto';
import { TrustListResponseDto } from './trust-list.response.dto';

/**
 * Translates between the HTTP-facing DTOs (this folder) and the
 * Application layer's commands/DTOs. The only place that knows both
 * shapes exist — `TrustController` never builds a
 * `CreateTrustProfileCommand` or a `TrustResponseDto` by hand.
 */
export class TrustHttpMapper {
  static toCreateCommand(
    dto: CreateTrustProfileRequestDto,
  ): CreateTrustProfileCommand {
    return new CreateTrustProfileCommand(dto.identityId, dto.score, dto.level);
  }

  static toUpdateCommand(
    id: string,
    dto: UpdateTrustProfileRequestDto,
  ): UpdateTrustProfileCommand {
    return new UpdateTrustProfileCommand(id, dto.score, dto.level, dto.status);
  }

  static toResponse(dto: TrustDto): TrustResponseDto {
    const response = new TrustResponseDto();
    response.id = dto.id;
    response.identityId = dto.identityId;
    response.score = dto.score;
    response.level = dto.level;
    response.status = dto.status;
    response.createdAt = dto.createdAt.toISOString();
    response.updatedAt = dto.updatedAt.toISOString();
    return response;
  }

  static toListResponse(
    result: PaginatedResult<TrustDto>,
  ): TrustListResponseDto {
    const response = new TrustListResponseDto();
    response.items = result.items.map((item) =>
      TrustHttpMapper.toResponse(item),
    );
    response.total = result.total;
    response.page = result.page;
    response.pageSize = result.pageSize;
    return response;
  }
}
