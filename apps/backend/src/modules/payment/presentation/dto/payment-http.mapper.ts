import { Caller } from '../../../core/application/caller';
import { PaginatedResult } from '../../../core/application/paginated-result';
import { CreatePaymentCommand } from '../../application/commands/create-payment.command';
import { UpdatePaymentCommand } from '../../application/commands/update-payment.command';
import { PaymentDto } from '../../application/dto/payment.dto';
import { CreatePaymentRequestDto } from './create-payment.request.dto';
import { UpdatePaymentRequestDto } from './update-payment.request.dto';
import { PaymentResponseDto } from './payment.response.dto';
import { PaymentListResponseDto } from './payment-list.response.dto';

/**
 * Translates between the HTTP-facing DTOs (this folder) and the
 * Application layer's commands/DTOs. The only place that knows both
 * shapes exist — `PaymentController` never builds a
 * `CreatePaymentCommand` or a `PaymentResponseDto` by hand.
 */
export class PaymentHttpMapper {
  static toCreateCommand(
    dto: CreatePaymentRequestDto,
    caller: Caller,
  ): CreatePaymentCommand {
    return new CreatePaymentCommand(
      dto.quoteId,
      dto.orderId,
      dto.payerIdentityId,
      dto.receiverProviderId,
      dto.amount,
      dto.method,
      caller,
    );
  }

  static toUpdateCommand(
    id: string,
    dto: UpdatePaymentRequestDto,
    caller: Caller,
  ): UpdatePaymentCommand {
    return new UpdatePaymentCommand(id, caller, dto.status);
  }

  static toResponse(dto: PaymentDto): PaymentResponseDto {
    const response = new PaymentResponseDto();
    response.id = dto.id;
    response.quoteId = dto.quoteId;
    response.orderId = dto.orderId;
    response.payerIdentityId = dto.payerIdentityId;
    response.receiverProviderId = dto.receiverProviderId;
    response.amount = dto.amount;
    response.method = dto.method;
    response.status = dto.status;
    response.createdAt = dto.createdAt.toISOString();
    response.updatedAt = dto.updatedAt.toISOString();
    return response;
  }

  static toListResponse(
    result: PaginatedResult<PaymentDto>,
  ): PaymentListResponseDto {
    const response = new PaymentListResponseDto();
    response.items = result.items.map((item) =>
      PaymentHttpMapper.toResponse(item),
    );
    response.total = result.total;
    response.page = result.page;
    response.pageSize = result.pageSize;
    return response;
  }
}
