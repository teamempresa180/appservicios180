import { VerificationRepository } from '../../domain/interfaces/verification-repository.interface';
import { SearchVerificationQuery } from '../queries/search-verification.query';
import { VerificationDto } from '../dto/verification.dto';
import { VerificationMapper } from '../mappers/verification.mapper';

/** Free-text search over `type`/`status`. */
export class SearchVerificationUseCase {
  constructor(
    private readonly verificationRepository: VerificationRepository,
  ) {}

  async execute(query: SearchVerificationQuery): Promise<VerificationDto[]> {
    const results = await this.verificationRepository.search(query.term);
    return results.map((verification) =>
      VerificationMapper.toDto(verification),
    );
  }
}
