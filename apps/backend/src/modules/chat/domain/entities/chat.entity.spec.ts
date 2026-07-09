import { Chat } from './chat.entity';
import { ChatId } from '../value-objects/chat-id.value-object';
import { ChatStatus } from '../value-objects/chat-status.value-object';
import { ChatType } from '../value-objects/chat-type.value-object';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';

describe('Chat', () => {
  it('holds all the assigned properties', () => {
    const id = ChatId.create();
    const orderId = OrderId.create();
    const clientIdentityId = IdentityId.create();
    const providerId = ProviderId.create();
    const now = new Date();
    const chat = new Chat(id, {
      orderId,
      clientIdentityId,
      providerId,
      status: ChatStatus.Active,
      type: ChatType.OrderRelated,
      createdAt: now,
      updatedAt: now,
    });

    expect(chat.id).toBe(id);
    expect(chat.orderId).toBe(orderId);
    expect(chat.clientIdentityId).toBe(clientIdentityId);
    expect(chat.providerId).toBe(providerId);
    expect(chat.status).toBe(ChatStatus.Active);
    expect(chat.type).toBe(ChatType.OrderRelated);
  });

  it('is equal to another chat with the same id', () => {
    const id = ChatId.create();
    const orderId = OrderId.create();
    const clientIdentityId = IdentityId.create();
    const providerId = ProviderId.create();
    const now = new Date();
    const props = {
      orderId,
      clientIdentityId,
      providerId,
      status: ChatStatus.Active,
      type: ChatType.Support,
      createdAt: now,
      updatedAt: now,
    };
    const a = new Chat(id, props);
    const b = new Chat(id, props);
    expect(a.equals(b)).toBe(true);
  });
});
