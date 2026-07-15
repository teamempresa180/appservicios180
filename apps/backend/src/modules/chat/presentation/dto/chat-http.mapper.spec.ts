import { ChatDto } from '../../application/dto/chat.dto';
import { ChatStatus } from '../../domain/value-objects/chat-status.value-object';
import { ChatType } from '../../domain/value-objects/chat-type.value-object';
import { CreateChatRequestDto } from './create-chat.request.dto';
import { ChatHttpMapper } from './chat-http.mapper';

describe('ChatHttpMapper', () => {
  it('toCreateCommand() maps every field in order', () => {
    const dto: CreateChatRequestDto = {
      orderId: 'order-1',
      clientIdentityId: 'identity-1',
      providerId: 'provider-1',
      type: ChatType.OrderRelated,
    };

    const command = ChatHttpMapper.toCreateCommand(dto);

    expect(command.orderId).toBe('order-1');
    expect(command.clientIdentityId).toBe('identity-1');
    expect(command.providerId).toBe('provider-1');
    expect(command.type).toBe(ChatType.OrderRelated);
  });

  it('toResponse() converts Date fields to ISO strings', () => {
    const dto: ChatDto = {
      id: 'id-1',
      orderId: 'order-1',
      clientIdentityId: 'identity-1',
      providerId: 'provider-1',
      status: ChatStatus.Active,
      type: ChatType.OrderRelated,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    };

    const response = ChatHttpMapper.toResponse(dto);

    expect(response.createdAt).toBe('2026-01-01T00:00:00.000Z');
    expect(response.updatedAt).toBe('2026-01-02T00:00:00.000Z');
  });

  it('toListResponse() maps each item and carries pagination metadata through', () => {
    const dto: ChatDto = {
      id: 'id-1',
      orderId: 'order-1',
      clientIdentityId: 'identity-1',
      providerId: 'provider-1',
      status: ChatStatus.Active,
      type: ChatType.OrderRelated,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    };

    const response = ChatHttpMapper.toListResponse({
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
