import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { CreateIdentityCommand } from '../../application/commands/create-identity.command';
import { UpdateIdentityCommand } from '../../application/commands/update-identity.command';
import { IdentityDto } from '../../application/dto/identity.dto';
import { CreateIdentityRequestDto } from './create-identity.request.dto';
import { UpdateIdentityRequestDto } from './update-identity.request.dto';
import { IdentityResponseDto } from './identity.response.dto';

/**
 * Translates between the HTTP-facing DTOs (this folder) and the
 * Application layer's commands/DTOs. The only place that knows both
 * shapes exist — `IdentityController` never builds a
 * `CreateIdentityCommand` or an `IdentityResponseDto` by hand.
 * `birthDate` is parsed here (ISO string → `Date`); malformed input
 * still reaches `IdentityValidator.validateCreate`, which already
 * rejects a non-`Date`/invalid `Date` — no validation logic is
 * duplicated here.
 */
export class IdentityHttpMapper {
  static toCreateCommand(dto: CreateIdentityRequestDto): CreateIdentityCommand {
    return new CreateIdentityCommand(
      dto.fullName,
      dto.documentType,
      dto.documentNumber,
      new Date(dto.birthDate),
    );
  }

  static toUpdateCommand(
    id: string,
    dto: UpdateIdentityRequestDto,
    caller: AuthenticatedUser,
  ): UpdateIdentityCommand {
    return new UpdateIdentityCommand(
      id,
      caller.id,
      caller.role,
      dto.fullName,
      dto.status,
    );
  }

  static toResponse(dto: IdentityDto): IdentityResponseDto {
    const response = new IdentityResponseDto();
    response.id = dto.id;
    response.fullName = dto.fullName;
    response.documentType = dto.documentType;
    response.documentNumber = dto.documentNumber;
    response.birthDate = dto.birthDate.toISOString();
    response.status = dto.status;
    response.createdAt = dto.createdAt.toISOString();
    response.updatedAt = dto.updatedAt.toISOString();
    return response;
  }
}
