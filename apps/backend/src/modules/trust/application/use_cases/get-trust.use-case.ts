import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { TrustRepository } from '../../domain/interfaces/trust-repository.interface';
import { TrustId } from '../../domain/value-objects/trust-id.value-object';
import { GetTrustQuery } from '../queries/get-trust.query';
import { TrustDto } from '../dto/trust.dto';
import { TrustMapper } from '../mappers/trust.mapper';

/**
 * Fetches a single Trust record by id. Throws `NotFoundException`
 * instead of returning `null` — same pattern as `GetIdentityUseCase`.
 */
export class GetTrustUseCase {
  constructor(private readonly trustRepository: TrustRepository) {}

  async execute(query: GetTrustQuery): Promise<TrustDto> {
    const trust = await this.trustRepository.findById(
      TrustId.fromString(query.id),
    );
    if (!trust) {
      throw new NotFoundException(`Trust ${query.id} not found`);
    }
    return TrustMapper.toDto(trust);
  }
}
