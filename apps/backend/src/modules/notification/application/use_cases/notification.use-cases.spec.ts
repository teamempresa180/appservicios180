import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { Role } from '../../../../common/auth/role.enum';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { Identity } from '../../../identity/domain/entities/identity.entity';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { DocumentType } from '../../../identity/domain/value-objects/document-type.value-object';
import { IdentityStatus } from '../../../identity/domain/value-objects/identity-status.value-object';
import { InMemoryIdentityRepository } from '../../../identity/application/use_cases/test-support/in-memory-identity.repository';
import { NotificationType } from '../../domain/value-objects/notification-type.value-object';
import { NotificationStatus } from '../../domain/value-objects/notification-status.value-object';
import { CreateNotificationCommand } from '../commands/create-notification.command';
import { MarkNotificationAsReadCommand } from '../commands/mark-notification-as-read.command';
import { DeleteNotificationCommand } from '../commands/delete-notification.command';
import { GetNotificationQuery } from '../queries/get-notification.query';
import { ListNotificationQuery } from '../queries/list-notification.query';
import { SearchNotificationQuery } from '../queries/search-notification.query';
import { InMemoryNotificationRepository } from './test-support/in-memory-notification.repository';
import { CreateNotificationUseCase } from './create-notification.use-case';
import { GetNotificationUseCase } from './get-notification.use-case';
import { MarkNotificationAsReadUseCase } from './mark-notification-as-read.use-case';
import { DeleteNotificationUseCase } from './delete-notification.use-case';
import { ListNotificationUseCase } from './list-notification.use-case';
import { SearchNotificationUseCase } from './search-notification.use-case';

describe('Notification use cases', () => {
  let repository: InMemoryNotificationRepository;
  let identityRepository: InMemoryIdentityRepository;
  let identityId: string;
  let caller: AuthenticatedUser;

  beforeEach(async () => {
    repository = new InMemoryNotificationRepository();
    identityRepository = new InMemoryIdentityRepository();

    const now = new Date();
    const identity = new Identity(IdentityId.create(), {
      fullName: 'Notification Recipient',
      documentType: DocumentType.NationalId,
      documentNumber: '123456789',
      birthDate: new Date('1990-01-01'),
      status: IdentityStatus.Active,
      createdAt: now,
      updatedAt: now,
    });
    await identityRepository.save(identity);
    identityId = identity.id.value;
    caller = { id: identityId, role: Role.Customer };
  });

  function createCommand(overrides: Partial<{ title: string }> = {}) {
    return new CreateNotificationCommand(
      caller,
      identityId,
      overrides.title ?? 'Your order was accepted',
      'Provider accepted your order request.',
      NotificationType.Info,
    );
  }

  function useCase() {
    return new CreateNotificationUseCase(repository, identityRepository);
  }

  describe('CreateNotificationUseCase', () => {
    it('creates a Notification in Unread status', async () => {
      const dto = await useCase().execute(createCommand());

      expect(dto.identityId).toBe(identityId);
      expect(dto.status).toBe(NotificationStatus.Unread);
      expect(dto.readAt).toBeNull();
    });

    it('throws NotFoundException when the Identity does not exist', async () => {
      await expect(
        useCase().execute(
          new CreateNotificationCommand(
            caller,
            'unknown-identity',
            'title',
            'body',
            NotificationType.Info,
          ),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('rejects a blank title', async () => {
      await expect(
        useCase().execute(
          new CreateNotificationCommand(
            caller,
            identityId,
            '  ',
            'body',
            NotificationType.Info,
          ),
        ),
      ).rejects.toThrow(ValidationException);
    });
  });

  describe('GetNotificationUseCase', () => {
    it('returns null when it does not exist', async () => {
      const result = await new GetNotificationUseCase(repository).execute(
        new GetNotificationQuery(caller, 'unknown-id'),
      );
      expect(result).toBeNull();
    });

    it('returns the Notification when it exists', async () => {
      const created = await useCase().execute(createCommand());

      const result = await new GetNotificationUseCase(repository).execute(
        new GetNotificationQuery(caller, created.id),
      );
      expect(result?.id).toBe(created.id);
    });
  });

  describe('MarkNotificationAsReadUseCase', () => {
    it('marks an existing Notification as read', async () => {
      const created = await useCase().execute(createCommand());

      const read = await new MarkNotificationAsReadUseCase(repository).execute(
        new MarkNotificationAsReadCommand(caller, created.id),
      );

      expect(read.status).toBe(NotificationStatus.Read);
      expect(read.readAt).not.toBeNull();
    });

    it('throws NotFoundException for an unknown id', async () => {
      await expect(
        new MarkNotificationAsReadUseCase(repository).execute(
          new MarkNotificationAsReadCommand(caller, 'unknown-id'),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('DeleteNotificationUseCase', () => {
    it('deletes an existing Notification', async () => {
      const created = await useCase().execute(createCommand());

      await new DeleteNotificationUseCase(repository).execute(
        new DeleteNotificationCommand(caller, created.id),
      );

      const result = await new GetNotificationUseCase(repository).execute(
        new GetNotificationQuery(caller, created.id),
      );
      expect(result).toBeNull();
    });

    it('throws NotFoundException for an unknown id', async () => {
      await expect(
        new DeleteNotificationUseCase(repository).execute(
          new DeleteNotificationCommand(caller, 'unknown-id'),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('ListNotificationUseCase', () => {
    it('paginates results', async () => {
      await useCase().execute(createCommand({ title: 'A' }));
      await useCase().execute(createCommand({ title: 'B' }));

      const page = await new ListNotificationUseCase(repository).execute(
        new ListNotificationQuery(caller, 1, 1),
      );

      expect(page.items).toHaveLength(1);
      expect(page.total).toBe(2);
    });
  });

  describe('recipient scoping', () => {
    const intruder: AuthenticatedUser = {
      id: 'another-identity',
      role: Role.Customer,
    };
    const admin: AuthenticatedUser = {
      id: 'admin-identity',
      role: Role.Admin,
    };

    it('GetNotificationUseCase rejects another Identity’s Notification', async () => {
      const created = await useCase().execute(createCommand());

      await expect(
        new GetNotificationUseCase(repository).execute(
          new GetNotificationQuery(intruder, created.id),
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('MarkNotificationAsReadUseCase rejects another Identity’s Notification', async () => {
      const created = await useCase().execute(createCommand());

      await expect(
        new MarkNotificationAsReadUseCase(repository).execute(
          new MarkNotificationAsReadCommand(intruder, created.id),
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('DeleteNotificationUseCase rejects another Identity’s Notification', async () => {
      const created = await useCase().execute(createCommand());

      await expect(
        new DeleteNotificationUseCase(repository).execute(
          new DeleteNotificationCommand(intruder, created.id),
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('ListNotificationUseCase hides Notifications addressed to another Identity', async () => {
      await useCase().execute(createCommand());

      const page = await new ListNotificationUseCase(repository).execute(
        new ListNotificationQuery(intruder),
      );

      expect(page.items).toHaveLength(0);
      expect(page.total).toBe(0);
    });

    it('SearchNotificationUseCase hides Notifications addressed to another Identity', async () => {
      await useCase().execute(createCommand({ title: 'Special Notification' }));

      const results = await new SearchNotificationUseCase(repository).execute(
        new SearchNotificationQuery(intruder, 'special'),
      );

      expect(results).toHaveLength(0);
    });

    it('an Admin caller sees every Notification', async () => {
      await useCase().execute(createCommand());

      const page = await new ListNotificationUseCase(repository).execute(
        new ListNotificationQuery(admin),
      );

      expect(page.total).toBe(1);
    });
  });

  describe('SearchNotificationUseCase', () => {
    it('finds Notifications by title', async () => {
      await useCase().execute(createCommand({ title: 'Special Notification' }));

      const results = await new SearchNotificationUseCase(repository).execute(
        new SearchNotificationQuery(caller, 'special'),
      );

      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('Special Notification');
    });
  });
});
