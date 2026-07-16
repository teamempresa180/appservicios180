import { CreateCredentialCommand } from '../../application/commands/create-credential.command';
import { UpdateCredentialCommand } from '../../application/commands/update-credential.command';
import { CredentialDto } from '../../application/dto/credential.dto';
import { CreateCredentialRequestDto } from './create-credential.request.dto';
import { UpdateCredentialRequestDto } from './update-credential.request.dto';
import { CredentialResponseDto } from './credential.response.dto';

/**
 * Translates between the HTTP-facing DTOs (this folder) and the
 * Application layer's commands/DTOs — see `IdentityHttpMapper` for
 * the rationale behind this separation.
 */
export class CredentialHttpMapper {
  static toCreateCommand(
    dto: CreateCredentialRequestDto,
  ): CreateCredentialCommand {
    return new CreateCredentialCommand(dto.identityId, dto.type, dto.password);
  }

  static toUpdateCommand(
    id: string,
    dto: UpdateCredentialRequestDto,
  ): UpdateCredentialCommand {
    return new UpdateCredentialCommand(id, dto.status);
  }

  static toResponse(dto: CredentialDto): CredentialResponseDto {
    const response = new CredentialResponseDto();
    response.id = dto.id;
    response.identityId = dto.identityId;
    response.type = dto.type;
    response.status = dto.status;
    response.createdAt = dto.createdAt.toISOString();
    response.updatedAt = dto.updatedAt.toISOString();
    return response;
  }
}
