import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ChatRepository } from '../../../chat/domain/interfaces/chat-repository.interface';
import { ChatId } from '../../../chat/domain/value-objects/chat-id.value-object';
import { IdentityRepository } from '../../../identity/domain/interfaces/identity-repository.interface';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Message } from '../../domain/entities/message.entity';
import { MessageRepository } from '../../domain/interfaces/message-repository.interface';
import { MessageId } from '../../domain/value-objects/message-id.value-object';
import { MessageStatus } from '../../domain/value-objects/message-status.value-object';
import { SendMessageCommand } from '../commands/send-message.command';
import { MessageDto } from '../dto/message.dto';
import { MessageMapper } from '../mappers/message.mapper';
import { MessageValidator } from '../validators/message.validator';

/**
 * Sends a new Message in an existing Chat, always in `Sent` status
 * with `readAt` unset. Depends on `ChatRepository` and
 * `IdentityRepository` to verify the referenced Chat and sender
 * Identity both exist before creating the message — Chat is
 * implemented earlier in this same Sprint 3, Etapa 10 prompt,
 * Identity since Etapa 2, so neither check is deferred.
 */
export class SendMessageUseCase {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly chatRepository: ChatRepository,
    private readonly identityRepository: IdentityRepository,
  ) {}

  async execute(command: SendMessageCommand): Promise<MessageDto> {
    MessageValidator.validateSend(command);

    const chatId = ChatId.fromString(command.chatId);
    const chat = await this.chatRepository.findById(chatId);
    if (!chat) {
      throw new NotFoundException(`Chat ${command.chatId} not found`);
    }

    const senderIdentityId = IdentityId.fromString(command.senderIdentityId);
    const sender = await this.identityRepository.findById(senderIdentityId);
    if (!sender) {
      throw new NotFoundException(
        `Identity ${command.senderIdentityId} not found`,
      );
    }

    const message = new Message(MessageId.create(), {
      chatId,
      senderIdentityId,
      content: command.content,
      type: command.type,
      status: MessageStatus.Sent,
      sentAt: new Date(),
      readAt: null,
    });

    await this.messageRepository.save(message);
    return MessageMapper.toDto(message);
  }
}
