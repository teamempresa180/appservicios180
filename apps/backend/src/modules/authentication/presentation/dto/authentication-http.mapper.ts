import { CreateAuthenticationCommand } from '../../application/commands/create-authentication.command';
import { UpdateAuthenticationCommand } from '../../application/commands/update-authentication.command';
import { AuthenticationDto } from '../../application/dto/authentication.dto';
import { CreateAuthenticationRequestDto } from './create-authentication.request.dto';
import { UpdateAuthenticationRequestDto } from './update-authentication.request.dto';
import { AuthenticationResponseDto } from './authentication.response.dto';

/**
 * Translates between the HTTP-facing DTOs (this folder) and the
 * Application layer's commands/DTOs — see `IdentityHttpMapper` for
 * the rationale behind this separation.
 */
export class AuthenticationHttpMapper {
  static toCreateCommand(
    dto: CreateAuthenticationRequestDto,
  ): CreateAuthenticationCommand {
    return new CreateAuthenticationCommand(dto.identityId, dto.methodType);
  }

  static toUpdateCommand(
    id: string,
    dto: UpdateAuthenticationRequestDto,
  ): UpdateAuthenticationCommand {
    return new UpdateAuthenticationCommand(id, dto.status);
  }

  static toResponse(dto: AuthenticationDto): AuthenticationResponseDto {
    const response = new AuthenticationResponseDto();
    response.id = dto.id;
    response.identityId = dto.identityId;
    response.methodType = dto.methodType;
    response.status = dto.status;
    response.createdAt = dto.createdAt.toISOString();
    response.updatedAt = dto.updatedAt.toISOString();
    return response;
  }
}
