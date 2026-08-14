import { Role } from '../../../../common/auth/role.enum';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { AuthenticationRepository } from '../../domain/interfaces/authentication-repository.interface';
import { AuthenticationId } from '../../domain/value-objects/authentication-id.value-object';
import { GetAuthenticationQuery } from '../queries/get-authentication.query';
import { AuthenticationDto } from '../dto/authentication.dto';
import { AuthenticationMapper } from '../mappers/authentication.mapper';

/**
 * Fetches a single Authentication method. Only the Identity it belongs
 * to (or an `Admin`) may read it — see `UpdateAuthenticationUseCase`
 * for why ownership is checked after the lookup rather than before it.
 */
export class GetAuthenticationUseCase {
  constructor(
    private readonly authenticationRepository: AuthenticationRepository,
  ) {}

  async execute(query: GetAuthenticationQuery): Promise<AuthenticationDto> {
    const authentication = await this.authenticationRepository.findById(
      AuthenticationId.fromString(query.id),
    );
    if (!authentication) {
      throw new NotFoundException(`Authentication ${query.id} not found`);
    }
    if (
      authentication.identityId.value !== query.callerId &&
      query.callerRole !== Role.Admin
    ) {
      throw new ForbiddenException(
        'You may only read your own Authentication methods',
      );
    }
    return AuthenticationMapper.toDto(authentication);
  }
}
