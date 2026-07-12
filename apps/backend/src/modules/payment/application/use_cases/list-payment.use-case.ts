import { PaginatedResult } from '../../../core/application/paginated-result';
import { PaymentRepository } from '../../domain/interfaces/payment-repository.interface';
import { ListPaymentQuery } from '../queries/list-payment.query';
import { PaymentDto } from '../dto/payment.dto';
import { PaymentMapper } from '../mappers/payment.mapper';

/** Lists Payments page by page. */
export class ListPaymentUseCase {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async execute(query: ListPaymentQuery): Promise<PaginatedResult<PaymentDto>> {
    const result = await this.paymentRepository.list(
      query.page,
      query.pageSize,
    );
    return {
      items: result.items.map((payment) => PaymentMapper.toDto(payment)),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  }
}
