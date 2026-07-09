import { Message } from './message.entity';
import { MessageId } from '../value-objects/message-id.value-object';
import { MessageType } from '../value-objects/message-type.value-object';
import { MessageStatus } from '../value-objects/message-status.value-object';
import { ChatId } from '../../../chat/domain/value-objects/chat-id.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';

describe('Message', () => {
  it('holds all the assigned properties', () => {
    const id = MessageId.create();
    const chatId = ChatId.create();
    const senderIdentityId = IdentityId.create();
    const now = new Date();
    const message = new Message(id, {
      chatId,
      senderIdentityId,
      content: 'Hola, ¿a qué hora llegas?',
      type: MessageType.Text,
      status: MessageStatus.Sent,
      sentAt: now,
      readAt: null,
    });

    expect(message.id).toBe(id);
    expect(message.chatId).toBe(chatId);
    expect(message.senderIdentityId).toBe(senderIdentityId);
    expect(message.content).toBe('Hola, ¿a qué hora llegas?');
    expect(message.type).toBe(MessageType.Text);
    expect(message.status).toBe(MessageStatus.Sent);
    expect(message.readAt).toBeNull();
  });

  it('is equal to another message with the same id', () => {
    const id = MessageId.create();
    const chatId = ChatId.create();
    const senderIdentityId = IdentityId.create();
    const now = new Date();
    const props = {
      chatId,
      senderIdentityId,
      content: 'Mensaje',
      type: MessageType.Text,
      status: MessageStatus.Read,
      sentAt: now,
      readAt: now,
    };
    const a = new Message(id, props);
    const b = new Message(id, props);
    expect(a.equals(b)).toBe(true);
  });
});
