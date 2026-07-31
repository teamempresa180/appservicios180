import { CategoryId } from '../../../category/domain/value-objects/category-id.value-object';
import { SpecializationId } from '../../../category/domain/value-objects/specialization-id.value-object';
import { ProviderRepository } from '../../domain/interfaces/provider-repository.interface';
import { FindCompatibleProvidersQuery } from '../queries/find-compatible-providers.query';
import { ProviderDto } from '../dto/provider.dto';
import { ProviderMapper } from '../mappers/provider.mapper';

/**
 * Powers the client's category → specialization → provider search
 * step: active Providers in a Category, optionally narrowed by an
 * exact `specializationId` match. Distinct from `SearchProviderUseCase`,
 * which is free-text over `type`/`biography` and not what a
 * marketplace category browse needs.
 */
export class FindCompatibleProvidersUseCase {
  constructor(private readonly providerRepository: ProviderRepository) {}

  async execute(query: FindCompatibleProvidersQuery): Promise<ProviderDto[]> {
    const results = await this.providerRepository.findCompatible(
      CategoryId.fromString(query.categoryId),
      query.specializationId
        ? SpecializationId.fromString(query.specializationId)
        : undefined,
    );
    return results.map((provider) => ProviderMapper.toDto(provider));
  }
}
