import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { Identity } from '../../../identity/domain/entities/identity.entity';
import { DocumentType } from '../../../identity/domain/value-objects/document-type.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { IdentityStatus } from '../../../identity/domain/value-objects/identity-status.value-object';
import { InMemoryIdentityRepository } from '../../../identity/application/use_cases/test-support/in-memory-identity.repository';
import { ContactType } from '../../domain/value-objects/contact-type.value-object';
import { ContactStatus } from '../../domain/value-objects/contact-status.value-object';
import { CreateContactCommand } from '../commands/create-contact.command';
import { DeleteContactCommand } from '../commands/delete-contact.command';
import { UpdateContactCommand } from '../commands/update-contact.command';
import { GetContactQuery } from '../queries/get-contact.query';
import { ListContactQuery } from '../queries/list-contact.query';
import { SearchContactQuery } from '../queries/search-contact.query';
import { InMemoryContactRepository } from './test-support/in-memory-contact.repository';
import { CreateContactUseCase } from './create-contact.use-case';
import { GetContactUseCase } from './get-contact.use-case';
import { UpdateContactUseCase } from './update-contact.use-case';
import { DeleteContactUseCase } from './delete-contact.use-case';
import { ListContactUseCase } from './list-contact.use-case';
import { SearchContactUseCase } from './search-contact.use-case';

describe('Contact use cases', () => {
  let repository: InMemoryContactRepository;
  let identityRepository: InMemoryIdentityRepository;
  let identityId: string;

  beforeEach(async () => {
    repository = new InMemoryContactRepository();
    identityRepository = new InMemoryIdentityRepository();

    const now = new Date();
    const identity = new Identity(IdentityId.create(), {
      fullName: 'Owner',
      documentType: DocumentType.NationalId,
      documentNumber: '123',
      birthDate: now,
      status: IdentityStatus.Active,
      createdAt: now,
      updatedAt: now,
    });
    await identityRepository.save(identity);
    identityId = identity.id.value;
  });

  describe('CreateContactUseCase', () => {
    it('creates a Contact in Active status', async () => {
      const useCase = new CreateContactUseCase(repository, identityRepository);
      const dto = await useCase.execute(
        new CreateContactCommand(identityId, ContactType.Email, 'a@b.com'),
      );

      expect(dto.identityId).toBe(identityId);
      expect(dto.value).toBe('a@b.com');
      expect(dto.status).toBe(ContactStatus.Active);
    });

    it('throws NotFoundException when the Identity does not exist', async () => {
      const useCase = new CreateContactUseCase(repository, identityRepository);
      await expect(
        useCase.execute(
          new CreateContactCommand(
            'unknown-identity',
            ContactType.Email,
            'a@b.com',
          ),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('rejects a blank value', async () => {
      const useCase = new CreateContactUseCase(repository, identityRepository);
      await expect(
        useCase.execute(
          new CreateContactCommand(identityId, ContactType.Email, '  '),
        ),
      ).rejects.toThrow(ValidationException);
    });

    it('rejects an invalid type', async () => {
      const useCase = new CreateContactUseCase(repository, identityRepository);
      await expect(
        useCase.execute(
          new CreateContactCommand(
            identityId,
            'NOT_A_TYPE' as ContactType,
            'a@b.com',
          ),
        ),
      ).rejects.toThrow(ValidationException);
    });
  });

  describe('GetContactUseCase', () => {
    it('throws NotFoundException when it does not exist', async () => {
      await expect(
        new GetContactUseCase(repository).execute(
          new GetContactQuery('unknown-id'),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('UpdateContactUseCase', () => {
    it('updates value and status', async () => {
      const created = await new CreateContactUseCase(
        repository,
        identityRepository,
      ).execute(
        new CreateContactCommand(identityId, ContactType.Email, 'a@b.com'),
      );

      const updated = await new UpdateContactUseCase(repository).execute(
        new UpdateContactCommand(created.id, 'c@d.com', ContactStatus.Inactive),
      );

      expect(updated.value).toBe('c@d.com');
      expect(updated.status).toBe(ContactStatus.Inactive);
    });

    it('throws NotFoundException for an unknown id', async () => {
      await expect(
        new UpdateContactUseCase(repository).execute(
          new UpdateContactCommand('unknown-id', 'c@d.com'),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('DeleteContactUseCase', () => {
    it('deletes an existing Contact', async () => {
      const created = await new CreateContactUseCase(
        repository,
        identityRepository,
      ).execute(
        new CreateContactCommand(identityId, ContactType.Email, 'a@b.com'),
      );

      await new DeleteContactUseCase(repository).execute(
        new DeleteContactCommand(created.id),
      );

      await expect(
        new GetContactUseCase(repository).execute(
          new GetContactQuery(created.id),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException for an unknown id', async () => {
      await expect(
        new DeleteContactUseCase(repository).execute(
          new DeleteContactCommand('unknown-id'),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('ListContactUseCase', () => {
    it('paginates results', async () => {
      const createUseCase = new CreateContactUseCase(
        repository,
        identityRepository,
      );
      await createUseCase.execute(
        new CreateContactCommand(identityId, ContactType.Email, 'a@b.com'),
      );
      await createUseCase.execute(
        new CreateContactCommand(identityId, ContactType.Phone, '555-0001'),
      );

      const page = await new ListContactUseCase(repository).execute(
        new ListContactQuery(1, 1),
      );

      expect(page.items).toHaveLength(1);
      expect(page.total).toBe(2);
    });
  });

  describe('SearchContactUseCase', () => {
    it('finds Contacts by value', async () => {
      await new CreateContactUseCase(repository, identityRepository).execute(
        new CreateContactCommand(
          identityId,
          ContactType.Email,
          'special@marker.com',
        ),
      );

      const results = await new SearchContactUseCase(repository).execute(
        new SearchContactQuery('special'),
      );

      expect(results).toHaveLength(1);
      expect(results[0].value).toBe('special@marker.com');
    });
  });
});
