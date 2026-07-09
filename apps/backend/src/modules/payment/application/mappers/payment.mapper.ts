import { Payment } from '../../domain/entities/payment.entity';
import { PaymentDto } from '../dto/payment.dto';

/**
 * Translates between the Payment domain entity and its DTOs.
 * Simple field-by-field mapping only — no business logic.
 */
export class PaymentMapper {
  static toDto(payment: Payment): PaymentDto {
    const dto = new PaymentDto();
    dto.id = payment.id.value;
    dto.quoteId = payment.quoteId.value;
    dto.orderId = payment.orderId.value;
    dto.payerIdentityId = payment.payerIdentityId.value;
    dto.receiverProviderId = payment.receiverProviderId.value;
    dto.amount = payment.amount;
    dto.method = payment.method;
    dto.status = payment.status;
    dto.createdAt = payment.createdAt;
    dto.updatedAt = payment.updatedAt;
    return dto;
  }
}
