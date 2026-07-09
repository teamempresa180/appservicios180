import { TrustRepository } from '../../domain/interfaces/trust-repository.interface';
import { TrustDto } from '../dto/trust.dto';
import { GetTrustQuery } from '../queries/get-trust.query';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class GetTrustUseCase {
  constructor(private readonly trustRepository: TrustRepository) {}

  execute(query: GetTrustQuery): Promise<TrustDto | null> {
    void this.trustRepository;
    void query;
    throw new Error('Not implemented yet');
  }
}
