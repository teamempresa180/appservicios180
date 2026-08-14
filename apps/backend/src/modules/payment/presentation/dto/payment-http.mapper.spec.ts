import { Caller } from '../../../core/application/caller';
import { PaymentDto } from '../../application/dto/payment.dto';
import { PaymentMethod } from '../../domain/value-objects/payment-method.value-object';
import { PaymentStatus } from '../../domain/value-objects/payment-status.value-object';
import { CreatePaymentRequestDto } from './create-payment.request.dto';
import { UpdatePaymentRequestDto } from './update-payment.request.dto';
import { PaymentHttpMapper } from './payment-http.mapper';

describe('PaymentHttpMapper', () => {
  const caller: Caller = { identityId: 'identity-1', isAdmin: false };

  it('toCreateCommand() maps every field in order', () => {
    const dto: CreatePaymentRequestDto = {
      quoteId: 'quote-1',
      orderId: 'order-1',
      payerIdentityId: 'identity-1',
      receiverProviderId: 'provider-1',
      amount: 75.0,
      method: PaymentMethod.Card,
    };

    const command = PaymentHttpMapper.toCreateCommand(dto, caller);

    expect(command.quoteId).toBe('quote-1');
    expect(command.orderId).toBe('order-1');
    expect(command.payerIdentityId).toBe('identity-1');
    expect(command.receiverProviderId).toBe('provider-1');
    expect(command.amount).toBe(75.0);
    expect(command.method).toBe(PaymentMethod.Card);
  });

  it('toUpdateCommand() carries the id and optional status through', () => {
    const dto: UpdatePaymentRequestDto = { status: PaymentStatus.Completed };

    const command = PaymentHttpMapper.toUpdateCommand('id-1', dto, caller);

    expect(command.id).toBe('id-1');
    expect(command.caller).toBe(caller);
    expect(command.status).toBe(PaymentStatus.Completed);
  });

  it('toResponse() converts Date fields to ISO strings', () => {
    const dto: PaymentDto = {
      id: 'id-1',
      quoteId: 'quote-1',
      orderId: 'order-1',
      payerIdentityId: 'identity-1',
      receiverProviderId: 'provider-1',
      amount: 75.0,
      method: PaymentMethod.Card,
      status: PaymentStatus.Pending,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    };

    const response = PaymentHttpMapper.toResponse(dto);

    expect(response.createdAt).toBe('2026-01-01T00:00:00.000Z');
    expect(response.updatedAt).toBe('2026-01-02T00:00:00.000Z');
  });

  it('toListResponse() maps each item and carries pagination metadata through', () => {
    const dto: PaymentDto = {
      id: 'id-1',
      quoteId: 'quote-1',
      orderId: 'order-1',
      payerIdentityId: 'identity-1',
      receiverProviderId: 'provider-1',
      amount: 75.0,
      method: PaymentMethod.Card,
      status: PaymentStatus.Pending,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    };

    const response = PaymentHttpMapper.toListResponse({
      items: [dto],
      total: 1,
      page: 1,
      pageSize: 20,
    });

    expect(response.items).toHaveLength(1);
    expect(response.items[0].id).toBe('id-1');
    expect(response.total).toBe(1);
  });
});
