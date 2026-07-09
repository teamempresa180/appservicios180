import { ProviderRepository } from '../../domain/interfaces/provider-repository.interface';
import { ProviderDto } from '../dto/provider.dto';
import { GetProviderQuery } from '../queries/get-provider.query';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class GetProviderUseCase {
  constructor(private readonly providerRepository: ProviderRepository) {}

  execute(query: GetProviderQuery): Promise<ProviderDto | null> {
    void this.providerRepository;
    void query;
    throw new Error('Not implemented yet');
  }
}
