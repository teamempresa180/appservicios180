import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { IdentityRepository } from '../../../identity/domain/interfaces/identity-repository.interface';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { OrderRepository } from '../../../order/domain/interfaces/order-repository.interface';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';
import { ProviderRepository } from '../../../provider/domain/interfaces/provider-repository.interface';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { Chat } from '../../domain/entities/chat.entity';
import { ChatRepository } from '../../domain/interfaces/chat-repository.interface';
import { ChatId } from '../../domain/value-objects/chat-id.value-object';
import { ChatStatus } from '../../domain/value-objects/chat-status.value-object';
import { CreateChatCommand } from '../commands/create-chat.command';
import { ChatDto } from '../dto/chat.dto';
import { ChatMapper } from '../mappers/chat.mapper';
import { ChatValidator } from '../validators/chat.validator';

/**
 * Creates a new Chat between a client and a provider tied to an
 * Order, always in `Active` status. Depends on `OrderRepository`,
 * `IdentityRepository` and `ProviderRepository` to verify the
 * referenced Order, client Identity and Provider all exist before
 * creating the chat — all three already have Infrastructure (Order
 * since Sprint 3 Etapa 8, Identity since Etapa 2, Provider since Etapa
 * 7), so none of these checks is deferred.
 */
export class CreateChatUseCase {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly orderRepository: OrderRepository,
    private readonly identityRepository: IdentityRepository,
    private readonly providerRepository: ProviderRepository,
  ) {}

  async execute(command: CreateChatCommand): Promise<ChatDto> {
    ChatValidator.validateCreate(command);

    const orderId = OrderId.fromString(command.orderId);
    const clientIdentityId = IdentityId.fromString(command.clientIdentityId);
    const providerId = ProviderId.fromString(command.providerId);

    // Independent existence checks against different tables — issued
    // together, then reported in the original order so the error a
    // caller sees is unchanged.
    const [order, client, provider] = await Promise.all([
      this.orderRepository.findById(orderId),
      this.identityRepository.findById(clientIdentityId),
      this.providerRepository.findById(providerId),
    ]);
    if (!order) {
      throw new NotFoundException(`Order ${command.orderId} not found`);
    }
    if (!client) {
      throw new NotFoundException(
        `Identity ${command.clientIdentityId} not found`,
      );
    }
    if (!provider) {
      throw new NotFoundException(`Provider ${command.providerId} not found`);
    }

    const now = new Date();
    const chat = new Chat(ChatId.create(), {
      orderId,
      clientIdentityId,
      providerId,
      status: ChatStatus.Active,
      type: command.type,
      createdAt: now,
      updatedAt: now,
    });

    await this.chatRepository.save(chat);
    return ChatMapper.toDto(chat);
  }
}
