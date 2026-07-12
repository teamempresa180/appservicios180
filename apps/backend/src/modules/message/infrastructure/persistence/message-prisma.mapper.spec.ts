import { MessageModel as PrismaMessage } from '@prisma/client';
import { ChatId } from '../../../chat/domain/value-objects/chat-id.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Message } from '../../domain/entities/message.entity';
import { MessageId } from '../../domain/value-objects/message-id.value-object';
import { MessageStatus } from '../../domain/value-objects/message-status.value-object';
import { MessageType } from '../../domain/value-objects/message-type.value-object';
import { MessagePrismaMapper } from './message-prisma.mapper';

describe('MessagePrismaMapper', () => {
  const row: PrismaMessage = {
    id: 'id-1',
    chatId: 'chat-1',
    senderIdentityId: 'identity-1',
    content: 'Hello there',
    type: 'TEXT',
    status: 'SENT',
    sentAt: new Date('2024-01-01'),
    readAt: null,
  };

  it('maps a Prisma row to the domain entity', () => {
    const message = MessagePrismaMapper.toDomain(row);

    expect(message.id.value).toBe('id-1');
    expect(message.chatId.value).toBe('chat-1');
    expect(message.senderIdentityId.value).toBe('identity-1');
    expect(message.status).toBe(MessageStatus.Sent);
    expect(message.type).toBe(MessageType.Text);
    expect(message.readAt).toBeNull();
  });

  it('maps a domain entity back to the Prisma row shape', () => {
    const message = new Message(MessageId.fromString('id-1'), {
      chatId: ChatId.fromString('chat-1'),
      senderIdentityId: IdentityId.fromString('identity-1'),
      content: 'Hello there',
      type: MessageType.Text,
      status: MessageStatus.Sent,
      sentAt: new Date('2024-01-01'),
      readAt: null,
    });

    expect(MessagePrismaMapper.toPersistence(message)).toEqual(row);
  });

  it('round-trips without losing data', () => {
    const message = MessagePrismaMapper.toDomain(row);
    expect(MessagePrismaMapper.toPersistence(message)).toEqual(row);
  });
});
