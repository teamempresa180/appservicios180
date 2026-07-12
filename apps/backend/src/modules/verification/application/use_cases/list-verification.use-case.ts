import { PaginatedResult } from '../../../core/application/paginated-result';
import { VerificationRepository } from '../../domain/interfaces/verification-repository.interface';
import { ListVerificationQuery } from '../queries/list-verification.query';
import { VerificationDto } from '../dto/verification.dto';
import { VerificationMapper } from '../mappers/verification.mapper';

/** Lists Verifications page by page. */
export class ListVerificationUseCase {
  constructor(
    private readonly verificationRepository: VerificationRepository,
  ) {}

  async execute(
    query: ListVerificationQuery,
  ): Promise<PaginatedResult<VerificationDto>> {
    const result = await this.verificationRepository.list(
      query.page,
      query.pageSize,
    );
    return {
      items: result.items.map((verification) =>
        VerificationMapper.toDto(verification),
      ),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  }
}
