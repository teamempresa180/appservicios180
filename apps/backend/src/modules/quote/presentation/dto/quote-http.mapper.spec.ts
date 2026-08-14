import { Caller } from '../../../core/application/caller';
import { QuoteDto } from '../../application/dto/quote.dto';
import { QuoteStatus } from '../../domain/value-objects/quote-status.value-object';
import { QuoteType } from '../../domain/value-objects/quote-type.value-object';
import { CreateQuoteRequestDto } from './create-quote.request.dto';
import { UpdateQuoteRequestDto } from './update-quote.request.dto';
import { QuoteHttpMapper } from './quote-http.mapper';

describe('QuoteHttpMapper', () => {
  const caller: Caller = { identityId: 'identity-1', isAdmin: false };

  it('toCreateCommand() carries all create fields through', () => {
    const dto: CreateQuoteRequestDto = {
      orderId: 'order-1',
      providerId: 'provider-1',
      proposedPrice: 75.0,
      estimatedDuration: 90,
      notes: 'Includes parts and labor.',
      type: QuoteType.Detailed,
    };

    const command = QuoteHttpMapper.toCreateCommand(dto, caller);

    expect(command.orderId).toBe('order-1');
    expect(command.providerId).toBe('provider-1');
    expect(command.proposedPrice).toBe(75.0);
    expect(command.type).toBe(QuoteType.Detailed);
  });

  it('toUpdateCommand() carries the id and optional fields through', () => {
    const dto: UpdateQuoteRequestDto = { notes: 'Updated notes.' };

    const command = QuoteHttpMapper.toUpdateCommand('id-1', dto, caller);

    expect(command.id).toBe('id-1');
    expect(command.caller).toBe(caller);
    expect(command.notes).toBe('Updated notes.');
  });

  it('toResponse() converts Date fields to ISO strings', () => {
    const dto: QuoteDto = {
      id: 'id-1',
      orderId: 'order-1',
      providerId: 'provider-1',
      proposedPrice: 75.0,
      estimatedDuration: 90,
      notes: 'Includes parts and labor.',
      status: QuoteStatus.Pending,
      type: QuoteType.Standard,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    };

    const response = QuoteHttpMapper.toResponse(dto);

    expect(response.createdAt).toBe('2026-01-01T00:00:00.000Z');
    expect(response.updatedAt).toBe('2026-01-02T00:00:00.000Z');
  });

  it('toListResponse() maps each item and carries pagination metadata through', () => {
    const dto: QuoteDto = {
      id: 'id-1',
      orderId: 'order-1',
      providerId: 'provider-1',
      proposedPrice: 75.0,
      estimatedDuration: 90,
      notes: 'Includes parts and labor.',
      status: QuoteStatus.Pending,
      type: QuoteType.Standard,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    };

    const response = QuoteHttpMapper.toListResponse({
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
