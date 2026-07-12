import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ProviderRepository } from '../../domain/interfaces/provider-repository.interface';
import { ProviderId } from '../../domain/value-objects/provider-id.value-object';
import { GetProviderQuery } from '../queries/get-provider.query';
import { ProviderDto } from '../dto/provider.dto';
import { ProviderMapper } from '../mappers/provider.mapper';

/**
 * Fetches a single Provider by id. Throws `NotFoundException` instead
 * of returning `null` — same pattern as `GetIdentityUseCase`.
 */
export class GetProviderUseCase {
  constructor(private readonly providerRepository: ProviderRepository) {}

  async execute(query: GetProviderQuery): Promise<ProviderDto> {
    const provider = await this.providerRepository.findById(
      ProviderId.fromString(query.id),
    );
    if (!provider) {
      throw new NotFoundException(`Provider ${query.id} not found`);
    }
    return ProviderMapper.toDto(provider);
  }
}
