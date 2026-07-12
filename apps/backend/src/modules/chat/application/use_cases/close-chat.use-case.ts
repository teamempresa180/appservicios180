import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { Chat } from '../../domain/entities/chat.entity';
import { ChatRepository } from '../../domain/interfaces/chat-repository.interface';
import { ChatId } from '../../domain/value-objects/chat-id.value-object';
import { ChatStatus } from '../../domain/value-objects/chat-status.value-object';
import { CloseChatCommand } from '../commands/close-chat.command';
import { ChatDto } from '../dto/chat.dto';
import { ChatMapper } from '../mappers/chat.mapper';
import { ChatValidator } from '../validators/chat.validator';

/**
 * Closes an existing Chat by transitioning it to `Closed` status. No
 * prior-status guard — same criterion as `CancelOrderUseCase`, which
 * applies the change unconditionally to any found entity.
 */
export class CloseChatUseCase {
  constructor(private readonly chatRepository: ChatRepository) {}

  async execute(command: CloseChatCommand): Promise<ChatDto> {
    ChatValidator.validateClose(command);

    const id = ChatId.fromString(command.id);
    const existing = await this.chatRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Chat ${command.id} not found`);
    }

    const closed = new Chat(existing.id, {
      orderId: existing.orderId,
      clientIdentityId: existing.clientIdentityId,
      providerId: existing.providerId,
      status: ChatStatus.Closed,
      type: existing.type,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });

    await this.chatRepository.save(closed);
    return ChatMapper.toDto(closed);
  }
}
