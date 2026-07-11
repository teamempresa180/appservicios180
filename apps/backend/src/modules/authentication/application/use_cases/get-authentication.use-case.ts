import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { AuthenticationRepository } from '../../domain/interfaces/authentication-repository.interface';
import { AuthenticationId } from '../../domain/value-objects/authentication-id.value-object';
import { GetAuthenticationQuery } from '../queries/get-authentication.query';
import { AuthenticationDto } from '../dto/authentication.dto';
import { AuthenticationMapper } from '../mappers/authentication.mapper';

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
    return AuthenticationMapper.toDto(authentication);
  }
}
