import { Role } from '../../../../common/auth/role.enum';
import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { Chat } from '../../../chat/domain/entities/chat.entity';
import { ChatId } from '../../../chat/domain/value-objects/chat-id.value-object';
import { ChatStatus } from '../../../chat/domain/value-objects/chat-status.value-object';
import { ChatType } from '../../../chat/domain/value-objects/chat-type.value-object';
import { InMemoryChatRepository } from '../../../chat/application/use_cases/test-support/in-memory-chat.repository';
import { ChatParticipationService } from '../../../chat/application/services/chat-participation.service';
import { Identity } from '../../../identity/domain/entities/identity.entity';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { DocumentType } from '../../../identity/domain/value-objects/document-type.value-object';
import { IdentityStatus } from '../../../identity/domain/value-objects/identity-status.value-object';
import { InMemoryIdentityRepository } from '../../../identity/application/use_cases/test-support/in-memory-identity.repository';
import { Provider } from '../../../provider/domain/entities/provider.entity';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { ProviderType } from '../../../provider/domain/value-objects/provider-type.value-object';
import { ProviderExperience } from '../../../provider/domain/value-objects/provider-experience.value-object';
import { ProviderStatus } from '../../../provider/domain/value-objects/provider-status.value-object';
import { InMemoryProviderRepository } from '../../../provider/application/use_cases/test-support/in-memory-provider.repository';
import { ProfileId } from '../../../profiles/domain/value-objects/profile-id.value-object';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';
import { MessageType } from '../../domain/value-objects/message-type.value-object';
import { MessageStatus } from '../../domain/value-objects/message-status.value-object';
import { SendMessageCommand } from '../commands/send-message.command';
import { DeleteMessageCommand } from '../commands/delete-message.command';
import { GetMessageQuery } from '../queries/get-message.query';
import { ListMessageQuery } from '../queries/list-message.query';
import { SearchMessageQuery } from '../queries/search-message.query';
import { InMemoryMessageRepository } from './test-support/in-memory-message.repository';
import { SendMessageUseCase } from './send-message.use-case';
import { GetMessageUseCase } from './get-message.use-case';
import { DeleteMessageUseCase } from './delete-message.use-case';
import { ListMessageUseCase } from './list-message.use-case';
import { SearchMessageUseCase } from './search-message.use-case';

describe('Message use cases', () => {
  let repository: InMemoryMessageRepository;
  let chatRepository: InMemoryChatRepository;
  let identityRepository: InMemoryIdentityRepository;
  let chatId: string;
  let senderIdentityId: string;
  let caller: AuthenticatedUser;
  let outsider: AuthenticatedUser;
  let participation: ChatParticipationService;

  beforeEach(async () => {
    chatRepository = new InMemoryChatRepository();
    repository = new InMemoryMessageRepository(chatRepository);
    identityRepository = new InMemoryIdentityRepository();
    const providerRepository = new InMemoryProviderRepository();

    const now = new Date();
    const sender = new Identity(IdentityId.create(), {
      fullName: 'Message Sender',
      documentType: DocumentType.NationalId,
      documentNumber: '123456789',
      birthDate: new Date('1990-01-01'),
      status: IdentityStatus.Active,
      createdAt: now,
      updatedAt: now,
    });
    await identityRepository.save(sender);
    senderIdentityId = sender.id.value;

    const provider = new Provider(ProviderId.create(), {
      identityId: IdentityId.create(),
      providerProfileId: ProfileId.create(),
      status: ProviderStatus.Active,
      type: ProviderType.Independent,
      experience: ProviderExperience.Intermediate,
      biography: 'bio',
      yearsOfExperience: 5,
      createdAt: now,
      updatedAt: now,
    });
    await providerRepository.save(provider);
    participation = new ChatParticipationService(providerRepository);
    caller = { id: senderIdentityId, role: Role.Customer };
    outsider = { id: IdentityId.create().value, role: Role.Customer };

    const chat = new Chat(ChatId.create(), {
      orderId: OrderId.create(),
      clientIdentityId: sender.id,
      providerId: provider.id,
      status: ChatStatus.Active,
      type: ChatType.OrderRelated,
      createdAt: now,
      updatedAt: now,
    });
    await chatRepository.save(chat);
    chatId = chat.id.value;
  });

  function createCommand(overrides: Partial<{ content: string }> = {}) {
    return new SendMessageCommand(
      chatId,
      senderIdentityId,
      overrides.content ?? 'Hello there',
      MessageType.Text,
      caller,
    );
  }

  function useCase() {
    return new SendMessageUseCase(
      repository,
      chatRepository,
      identityRepository,
      participation,
    );
  }

  describe('SendMessageUseCase', () => {
    it('sends a Message in Sent status', async () => {
      const dto = await useCase().execute(createCommand());

      expect(dto.chatId).toBe(chatId);
      expect(dto.senderIdentityId).toBe(senderIdentityId);
      expect(dto.status).toBe(MessageStatus.Sent);
      expect(dto.readAt).toBeNull();
    });

    it('throws NotFoundException when the Chat does not exist', async () => {
      await expect(
        useCase().execute(
          new SendMessageCommand(
            'unknown-chat',
            senderIdentityId,
            'Hello',
            MessageType.Text,
            caller,
          ),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    // An Admin caller: a non-admin naming somebody else as the sender
    // is rejected as impersonation long before the Identity is looked
    // up, so only an Admin can still reach this branch.
    it('throws NotFoundException when the sender Identity does not exist', async () => {
      await expect(
        useCase().execute(
          new SendMessageCommand(
            chatId,
            'unknown-identity',
            'Hello',
            MessageType.Text,
            { id: IdentityId.create().value, role: Role.Admin },
          ),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException when the caller is not the named sender', async () => {
      await expect(
        useCase().execute(
          new SendMessageCommand(
            chatId,
            senderIdentityId,
            'Hello',
            MessageType.Text,
            outsider,
          ),
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('throws ForbiddenException when the sender is not a participant of the Chat', async () => {
      const stranger = new Identity(IdentityId.create(), {
        fullName: 'Stranger',
        documentType: DocumentType.NationalId,
        documentNumber: '987654321',
        birthDate: new Date('1990-01-01'),
        status: IdentityStatus.Active,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await identityRepository.save(stranger);

      await expect(
        useCase().execute(
          new SendMessageCommand(
            chatId,
            stranger.id.value,
            'Hello',
            MessageType.Text,
            { id: stranger.id.value, role: Role.Customer },
          ),
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('rejects a blank content', async () => {
      await expect(
        useCase().execute(
          new SendMessageCommand(
            chatId,
            senderIdentityId,
            '  ',
            MessageType.Text,
            caller,
          ),
        ),
      ).rejects.toThrow(ValidationException);
    });
  });

  function getUseCase() {
    return new GetMessageUseCase(repository, chatRepository, participation);
  }

  describe('GetMessageUseCase', () => {
    it('returns null when it does not exist', async () => {
      const result = await getUseCase().execute(
        new GetMessageQuery('unknown-id', caller),
      );
      expect(result).toBeNull();
    });

    it('returns the Message when it exists', async () => {
      const created = await useCase().execute(createCommand());

      const result = await getUseCase().execute(
        new GetMessageQuery(created.id, caller),
      );
      expect(result?.id).toBe(created.id);
    });

    it('throws ForbiddenException for a non-participant of the Chat', async () => {
      const created = await useCase().execute(createCommand());

      await expect(
        getUseCase().execute(new GetMessageQuery(created.id, outsider)),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('DeleteMessageUseCase', () => {
    it('deletes an existing Message', async () => {
      const created = await useCase().execute(createCommand());

      await new DeleteMessageUseCase(repository).execute(
        new DeleteMessageCommand(created.id, caller),
      );

      const result = await getUseCase().execute(
        new GetMessageQuery(created.id, caller),
      );
      expect(result).toBeNull();
    });

    it('throws NotFoundException for an unknown id', async () => {
      await expect(
        new DeleteMessageUseCase(repository).execute(
          new DeleteMessageCommand('unknown-id', caller),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException for anyone but the original sender', async () => {
      const created = await useCase().execute(createCommand());

      await expect(
        new DeleteMessageUseCase(repository).execute(
          new DeleteMessageCommand(created.id, outsider),
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('ListMessageUseCase', () => {
    it('paginates results', async () => {
      await useCase().execute(createCommand({ content: 'A' }));
      await useCase().execute(createCommand({ content: 'B' }));

      const page = await new ListMessageUseCase(
        repository,
        participation,
      ).execute(new ListMessageQuery(caller, 1, 1));

      expect(page.items).toHaveLength(1);
      expect(page.total).toBe(2);
    });

    it('hides Messages from Chats the caller does not take part in', async () => {
      await useCase().execute(createCommand({ content: 'A' }));

      const page = await new ListMessageUseCase(
        repository,
        participation,
      ).execute(new ListMessageQuery(outsider));

      expect(page.items).toHaveLength(0);
      expect(page.total).toBe(0);
    });
  });

  describe('SearchMessageUseCase', () => {
    it('finds Messages by content', async () => {
      await useCase().execute(createCommand({ content: 'Special Message' }));

      const results = await new SearchMessageUseCase(
        repository,
        participation,
      ).execute(new SearchMessageQuery('special', caller));

      expect(results).toHaveLength(1);
      expect(results[0].content).toBe('Special Message');
    });

    it('does not leak Messages of other people’s conversations', async () => {
      await useCase().execute(createCommand({ content: 'Special Message' }));

      const results = await new SearchMessageUseCase(
        repository,
        participation,
      ).execute(new SearchMessageQuery('special', outsider));

      expect(results).toHaveLength(0);
    });
  });
});
