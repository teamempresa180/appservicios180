import { ChatModel as PrismaChat } from '@prisma/client';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { Chat } from '../../domain/entities/chat.entity';
import { ChatId } from '../../domain/value-objects/chat-id.value-object';
import { ChatStatus } from '../../domain/value-objects/chat-status.value-object';
import { ChatType } from '../../domain/value-objects/chat-type.value-object';
import { ChatPrismaMapper } from './chat-prisma.mapper';

describe('ChatPrismaMapper', () => {
  const row: PrismaChat = {
    id: 'id-1',
    orderId: 'order-1',
    clientIdentityId: 'identity-1',
    providerId: 'provider-1',
    status: 'ACTIVE',
    type: 'ORDER_RELATED',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
  };

  it('maps a Prisma row to the domain entity', () => {
    const chat = ChatPrismaMapper.toDomain(row);

    expect(chat.id.value).toBe('id-1');
    expect(chat.orderId.value).toBe('order-1');
    expect(chat.clientIdentityId.value).toBe('identity-1');
    expect(chat.providerId.value).toBe('provider-1');
    expect(chat.status).toBe(ChatStatus.Active);
    expect(chat.type).toBe(ChatType.OrderRelated);
  });

  it('maps a domain entity back to the Prisma row shape', () => {
    const chat = new Chat(ChatId.fromString('id-1'), {
      orderId: OrderId.fromString('order-1'),
      clientIdentityId: IdentityId.fromString('identity-1'),
      providerId: ProviderId.fromString('provider-1'),
      status: ChatStatus.Active,
      type: ChatType.OrderRelated,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
    });

    expect(ChatPrismaMapper.toPersistence(chat)).toEqual(row);
  });

  it('round-trips without losing data', () => {
    const chat = ChatPrismaMapper.toDomain(row);
    expect(ChatPrismaMapper.toPersistence(chat)).toEqual(row);
  });
});
