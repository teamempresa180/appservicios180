import { Role } from '../../../../common/auth/role.enum';
import { MessageDto } from '../../application/dto/message.dto';
import { MessageStatus } from '../../domain/value-objects/message-status.value-object';
import { MessageType } from '../../domain/value-objects/message-type.value-object';
import { SendMessageRequestDto } from './send-message.request.dto';
import { MessageHttpMapper } from './message-http.mapper';

describe('MessageHttpMapper', () => {
  it('toSendCommand() maps every field in order', () => {
    const dto: SendMessageRequestDto = {
      chatId: 'chat-1',
      senderIdentityId: 'identity-1',
      content: 'On my way.',
      type: MessageType.Text,
    };

    const command = MessageHttpMapper.toSendCommand(dto, {
      id: 'identity-1',
      role: Role.Customer,
    });

    expect(command.chatId).toBe('chat-1');
    expect(command.senderIdentityId).toBe('identity-1');
    expect(command.content).toBe('On my way.');
    expect(command.type).toBe(MessageType.Text);
    expect(command.caller.id).toBe('identity-1');
  });

  it('toResponse() converts sentAt to an ISO string and readAt to null when absent', () => {
    const dto: MessageDto = {
      id: 'id-1',
      chatId: 'chat-1',
      senderIdentityId: 'identity-1',
      content: 'On my way.',
      type: MessageType.Text,
      status: MessageStatus.Sent,
      sentAt: new Date('2026-01-01T00:00:00.000Z'),
      readAt: null,
    };

    const response = MessageHttpMapper.toResponse(dto);

    expect(response.sentAt).toBe('2026-01-01T00:00:00.000Z');
    expect(response.readAt).toBeNull();
  });

  it('toResponse() converts a present readAt to an ISO string', () => {
    const dto: MessageDto = {
      id: 'id-1',
      chatId: 'chat-1',
      senderIdentityId: 'identity-1',
      content: 'On my way.',
      type: MessageType.Text,
      status: MessageStatus.Read,
      sentAt: new Date('2026-01-01T00:00:00.000Z'),
      readAt: new Date('2026-01-01T01:00:00.000Z'),
    };

    const response = MessageHttpMapper.toResponse(dto);

    expect(response.readAt).toBe('2026-01-01T01:00:00.000Z');
  });

  it('toListResponse() maps each item and carries pagination metadata through', () => {
    const dto: MessageDto = {
      id: 'id-1',
      chatId: 'chat-1',
      senderIdentityId: 'identity-1',
      content: 'On my way.',
      type: MessageType.Text,
      status: MessageStatus.Sent,
      sentAt: new Date('2026-01-01T00:00:00.000Z'),
      readAt: null,
    };

    const response = MessageHttpMapper.toListResponse({
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
