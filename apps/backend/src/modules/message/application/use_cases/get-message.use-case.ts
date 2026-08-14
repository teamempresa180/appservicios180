import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ChatRepository } from '../../../chat/domain/interfaces/chat-repository.interface';
import { ChatParticipationService } from '../../../chat/application/services/chat-participation.service';
import { MessageRepository } from '../../domain/interfaces/message-repository.interface';
import { MessageId } from '../../domain/value-objects/message-id.value-object';
import { MessageDto } from '../dto/message.dto';
import { MessageMapper } from '../mappers/message.mapper';
import { GetMessageQuery } from '../queries/get-message.query';

/**
 * Fetches a single Message by id, returning `null` when not found —
 * matches the `Promise<MessageDto | null>` signature already declared
 * for this use case.
 *
 * A found Message is only handed to a participant of its Chat (or an
 * Admin). The Chat is loaded for exactly that check; a Message whose
 * Chat has vanished is reported as not found rather than served
 * unchecked.
 */
export class GetMessageUseCase {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly chatRepository: ChatRepository,
    private readonly participation: ChatParticipationService,
  ) {}

  async execute(query: GetMessageQuery): Promise<MessageDto | null> {
    const message = await this.messageRepository.findById(
      MessageId.fromString(query.id),
    );
    if (!message) {
      return null;
    }

    const chat = await this.chatRepository.findById(message.chatId);
    if (!chat) {
      throw new NotFoundException(`Chat ${message.chatId.value} not found`);
    }
    await this.participation.assertParticipant(chat, query.caller);

    return MessageMapper.toDto(message);
  }
}
