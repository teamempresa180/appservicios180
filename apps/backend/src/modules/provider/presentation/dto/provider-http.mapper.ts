import { PaginatedResult } from '../../../core/application/paginated-result';
import { CreateProviderCommand } from '../../application/commands/create-provider.command';
import { UpdateProviderCommand } from '../../application/commands/update-provider.command';
import { ProviderDto } from '../../application/dto/provider.dto';
import { CreateProviderRequestDto } from './create-provider.request.dto';
import { UpdateProviderRequestDto } from './update-provider.request.dto';
import { ProviderResponseDto } from './provider.response.dto';
import { ProviderListResponseDto } from './provider-list.response.dto';

/**
 * Translates between the HTTP-facing DTOs (this folder) and the
 * Application layer's commands/DTOs. The only place that knows both
 * shapes exist — `ProviderController` never builds a
 * `CreateProviderCommand` or a `ProviderResponseDto` by hand.
 */
export class ProviderHttpMapper {
  static toCreateCommand(dto: CreateProviderRequestDto): CreateProviderCommand {
    return new CreateProviderCommand(
      dto.identityId,
      dto.providerProfileId,
      dto.type,
      dto.experience,
      dto.biography,
      dto.yearsOfExperience,
      dto.categoryId,
      dto.specialization,
    );
  }

  static toUpdateCommand(
    id: string,
    dto: UpdateProviderRequestDto,
  ): UpdateProviderCommand {
    return new UpdateProviderCommand(
      id,
      dto.biography,
      dto.experience,
      dto.status,
      dto.categoryId,
      dto.specialization,
    );
  }

  static toResponse(dto: ProviderDto): ProviderResponseDto {
    const response = new ProviderResponseDto();
    response.id = dto.id;
    response.identityId = dto.identityId;
    response.providerProfileId = dto.providerProfileId;
    response.categoryId = dto.categoryId;
    response.specialization = dto.specialization;
    response.status = dto.status;
    response.type = dto.type;
    response.experience = dto.experience;
    response.biography = dto.biography;
    response.yearsOfExperience = dto.yearsOfExperience;
    response.createdAt = dto.createdAt.toISOString();
    response.updatedAt = dto.updatedAt.toISOString();
    return response;
  }

  static toListResponse(
    result: PaginatedResult<ProviderDto>,
  ): ProviderListResponseDto {
    const response = new ProviderListResponseDto();
    response.items = result.items.map((item) =>
      ProviderHttpMapper.toResponse(item),
    );
    response.total = result.total;
    response.page = result.page;
    response.pageSize = result.pageSize;
    return response;
  }
}
