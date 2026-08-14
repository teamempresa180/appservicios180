import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { Role } from '../../../../common/auth/role.enum';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { Message } from '../../../message/domain/entities/message.entity';
import { MessageId } from '../../../message/domain/value-objects/message-id.value-object';
import { MessageStatus } from '../../../message/domain/value-objects/message-status.value-object';
import { MessageType } from '../../../message/domain/value-objects/message-type.value-object';
import { InMemoryMessageRepository } from '../../../message/application/use_cases/test-support/in-memory-message.repository';
import { ChatId } from '../../../chat/domain/value-objects/chat-id.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { AttachmentType } from '../../domain/value-objects/attachment-type.value-object';
import { AttachmentStatus } from '../../domain/value-objects/attachment-status.value-object';
import { CreateAttachmentCommand } from '../commands/create-attachment.command';
import { DeleteAttachmentCommand } from '../commands/delete-attachment.command';
import { GetAttachmentQuery } from '../queries/get-attachment.query';
import { ListAttachmentQuery } from '../queries/list-attachment.query';
import { SearchAttachmentQuery } from '../queries/search-attachment.query';
import { InMemoryAttachmentRepository } from './test-support/in-memory-attachment.repository';
import { CreateAttachmentUseCase } from './create-attachment.use-case';
import { GetAttachmentUseCase } from './get-attachment.use-case';
import { DeleteAttachmentUseCase } from './delete-attachment.use-case';
import { ListAttachmentUseCase } from './list-attachment.use-case';
import { SearchAttachmentUseCase } from './search-attachment.use-case';

describe('Attachment use cases', () => {
  let repository: InMemoryAttachmentRepository;
  let messageRepository: InMemoryMessageRepository;
  let messageId: string;
  /** The Message's sender — the only Identity allowed to attach to it. */
  let caller: AuthenticatedUser;
  /** The other side of the Chat — sees Attachments, cannot mutate them. */
  let peer: AuthenticatedUser;

  beforeEach(async () => {
    repository = new InMemoryAttachmentRepository();
    messageRepository = new InMemoryMessageRepository();

    const now = new Date();
    const senderIdentityId = IdentityId.create();
    const peerIdentityId = IdentityId.create();
    const message = new Message(MessageId.create(), {
      chatId: ChatId.create(),
      senderIdentityId,
      content: 'Here is the photo',
      type: MessageType.Text,
      status: MessageStatus.Sent,
      sentAt: now,
      readAt: null,
    });
    await messageRepository.save(message);
    messageId = message.id.value;

    caller = { id: senderIdentityId.value, role: Role.Customer };
    peer = { id: peerIdentityId.value, role: Role.Provider };
    repository.registerParticipants(messageId, [
      senderIdentityId.value,
      peerIdentityId.value,
    ]);
  });

  function createCommand(overrides: Partial<{ fileName: string }> = {}) {
    return new CreateAttachmentCommand(
      caller,
      messageId,
      overrides.fileName ?? 'photo.jpg',
      'image/jpeg',
      2048,
      AttachmentType.Image,
    );
  }

  function useCase() {
    return new CreateAttachmentUseCase(repository, messageRepository);
  }

  describe('CreateAttachmentUseCase', () => {
    it('creates an Attachment in Pending status', async () => {
      const dto = await useCase().execute(createCommand());

      expect(dto.messageId).toBe(messageId);
      expect(dto.status).toBe(AttachmentStatus.Pending);
    });

    it('throws NotFoundException when the Message does not exist', async () => {
      await expect(
        useCase().execute(
          new CreateAttachmentCommand(
            caller,
            'unknown-message',
            'photo.jpg',
            'image/jpeg',
            2048,
            AttachmentType.Image,
          ),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('rejects a non-positive fileSize', async () => {
      await expect(
        useCase().execute(
          new CreateAttachmentCommand(
            caller,
            messageId,
            'photo.jpg',
            'image/jpeg',
            0,
            AttachmentType.Image,
          ),
        ),
      ).rejects.toThrow(ValidationException);
    });
  });

  describe('GetAttachmentUseCase', () => {
    it('returns null when it does not exist', async () => {
      const result = await new GetAttachmentUseCase(repository).execute(
        new GetAttachmentQuery(caller, 'unknown-id'),
      );
      expect(result).toBeNull();
    });

    it('returns the Attachment when it exists', async () => {
      const created = await useCase().execute(createCommand());

      const result = await new GetAttachmentUseCase(repository).execute(
        new GetAttachmentQuery(caller, created.id),
      );
      expect(result?.id).toBe(created.id);
    });
  });

  describe('DeleteAttachmentUseCase', () => {
    it('deletes an existing Attachment', async () => {
      const created = await useCase().execute(createCommand());

      await new DeleteAttachmentUseCase(repository, messageRepository).execute(
        new DeleteAttachmentCommand(caller, created.id),
      );

      const result = await new GetAttachmentUseCase(repository).execute(
        new GetAttachmentQuery(caller, created.id),
      );
      expect(result).toBeNull();
    });

    it('throws NotFoundException for an unknown id', async () => {
      await expect(
        new DeleteAttachmentUseCase(repository, messageRepository).execute(
          new DeleteAttachmentCommand(caller, 'unknown-id'),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('ListAttachmentUseCase', () => {
    it('paginates results', async () => {
      await useCase().execute(createCommand({ fileName: 'a.jpg' }));
      await useCase().execute(createCommand({ fileName: 'b.jpg' }));

      const page = await new ListAttachmentUseCase(repository).execute(
        new ListAttachmentQuery(caller, 1, 1),
      );

      expect(page.items).toHaveLength(1);
      expect(page.total).toBe(2);
    });
  });

  describe('authorization', () => {
    const stranger: AuthenticatedUser = {
      id: 'stranger-identity',
      role: Role.Customer,
    };
    const admin: AuthenticatedUser = {
      id: 'admin-identity',
      role: Role.Admin,
    };

    it('CreateAttachmentUseCase rejects attaching to someone else’s Message', async () => {
      await expect(
        useCase().execute(
          new CreateAttachmentCommand(
            peer,
            messageId,
            'photo.jpg',
            'image/jpeg',
            2048,
            AttachmentType.Image,
          ),
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('DeleteAttachmentUseCase rejects a chat peer deleting the sender’s Attachment', async () => {
      const created = await useCase().execute(createCommand());

      await expect(
        new DeleteAttachmentUseCase(repository, messageRepository).execute(
          new DeleteAttachmentCommand(peer, created.id),
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('GetAttachmentUseCase lets the chat peer read the Attachment', async () => {
      const created = await useCase().execute(createCommand());

      const result = await new GetAttachmentUseCase(repository).execute(
        new GetAttachmentQuery(peer, created.id),
      );

      expect(result?.id).toBe(created.id);
    });

    it('GetAttachmentUseCase rejects an Identity outside the Chat', async () => {
      const created = await useCase().execute(createCommand());

      await expect(
        new GetAttachmentUseCase(repository).execute(
          new GetAttachmentQuery(stranger, created.id),
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('ListAttachmentUseCase hides Attachments from Chats the caller is not in', async () => {
      await useCase().execute(createCommand());

      const page = await new ListAttachmentUseCase(repository).execute(
        new ListAttachmentQuery(stranger),
      );

      expect(page.items).toHaveLength(0);
      expect(page.total).toBe(0);
    });

    it('ListAttachmentUseCase shows the chat peer the conversation’s Attachments', async () => {
      await useCase().execute(createCommand());

      const page = await new ListAttachmentUseCase(repository).execute(
        new ListAttachmentQuery(peer),
      );

      expect(page.total).toBe(1);
    });

    it('SearchAttachmentUseCase hides Attachments from Chats the caller is not in', async () => {
      await useCase().execute(createCommand({ fileName: 'secret-plan.pdf' }));

      const results = await new SearchAttachmentUseCase(repository).execute(
        new SearchAttachmentQuery(stranger, 'secret'),
      );

      expect(results).toHaveLength(0);
    });

    it('an Admin caller sees every Attachment', async () => {
      await useCase().execute(createCommand());

      const page = await new ListAttachmentUseCase(repository).execute(
        new ListAttachmentQuery(admin),
      );

      expect(page.total).toBe(1);
    });
  });

  describe('SearchAttachmentUseCase', () => {
    it('finds Attachments by fileName', async () => {
      await useCase().execute(createCommand({ fileName: 'special-photo.jpg' }));

      const results = await new SearchAttachmentUseCase(repository).execute(
        new SearchAttachmentQuery(caller, 'special'),
      );

      expect(results).toHaveLength(1);
      expect(results[0].fileName).toBe('special-photo.jpg');
    });
  });
});
