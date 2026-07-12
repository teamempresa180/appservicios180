import { PaymentRepository } from '../../domain/interfaces/payment-repository.interface';
import { SearchPaymentQuery } from '../queries/search-payment.query';
import { PaymentDto } from '../dto/payment.dto';
import { PaymentMapper } from '../mappers/payment.mapper';

/** Free-text search over `method`. */
export class SearchPaymentUseCase {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async execute(query: SearchPaymentQuery): Promise<PaymentDto[]> {
    const results = await this.paymentRepository.search(query.term);
    return results.map((payment) => PaymentMapper.toDto(payment));
  }
}
