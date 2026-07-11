import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { DocumentType } from '../../domain/value-objects/document-type.value-object';
import { IdentityStatus } from '../../domain/value-objects/identity-status.value-object';
import { CreateIdentityCommand } from '../commands/create-identity.command';
import { DeleteIdentityCommand } from '../commands/delete-identity.command';
import { UpdateIdentityCommand } from '../commands/update-identity.command';
import { GetIdentityQuery } from '../queries/get-identity.query';
import { ListIdentityQuery } from '../queries/list-identity.query';
import { SearchIdentityQuery } from '../queries/search-identity.query';
import { IdentityId } from '../../domain/value-objects/identity-id.value-object';
import { InMemoryIdentityRepository } from './test-support/in-memory-identity.repository';
import { CreateIdentityUseCase } from './create-identity.use-case';
import { GetIdentityUseCase } from './get-identity.use-case';
import { UpdateIdentityUseCase } from './update-identity.use-case';
import { DeleteIdentityUseCase } from './delete-identity.use-case';
import { ListIdentityUseCase } from './list-identity.use-case';
import { SearchIdentityUseCase } from './search-identity.use-case';

describe('Identity use cases', () => {
  let repository: InMemoryIdentityRepository;

  beforeEach(() => {
    repository = new InMemoryIdentityRepository();
  });

  describe('CreateIdentityUseCase', () => {
    it('creates an Identity in Active status', async () => {
      const useCase = new CreateIdentityUseCase(repository);
      const dto = await useCase.execute(
        new CreateIdentityCommand(
          'Ana María Gómez',
          DocumentType.NationalId,
          '1002003000',
          new Date('1990-05-10'),
        ),
      );

      expect(dto.fullName).toBe('Ana María Gómez');
      expect(dto.status).toBe(IdentityStatus.Active);
      expect(
        await repository.findById(IdentityId.fromString(dto.id)),
      ).not.toBeNull();
    });

    it('rejects a blank fullName', async () => {
      const useCase = new CreateIdentityUseCase(repository);
      await expect(
        useCase.execute(
          new CreateIdentityCommand(
            '  ',
            DocumentType.NationalId,
            '123',
            new Date(),
          ),
        ),
      ).rejects.toThrow(ValidationException);
    });

    it('rejects an invalid documentType', async () => {
      const useCase = new CreateIdentityUseCase(repository);
      await expect(
        useCase.execute(
          new CreateIdentityCommand(
            'Ana',
            'NOT_A_TYPE' as DocumentType,
            '123',
            new Date(),
          ),
        ),
      ).rejects.toThrow(ValidationException);
    });
  });

  describe('GetIdentityUseCase', () => {
    it('returns the Identity when it exists', async () => {
      const created = await new CreateIdentityUseCase(repository).execute(
        new CreateIdentityCommand(
          'Ana',
          DocumentType.NationalId,
          '123',
          new Date(),
        ),
      );

      const found = await new GetIdentityUseCase(repository).execute(
        new GetIdentityQuery(created.id),
      );
      expect(found.id).toBe(created.id);
    });

    it('throws NotFoundException when it does not exist', async () => {
      await expect(
        new GetIdentityUseCase(repository).execute(
          new GetIdentityQuery('unknown-id'),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('UpdateIdentityUseCase', () => {
    it('updates fullName and status', async () => {
      const created = await new CreateIdentityUseCase(repository).execute(
        new CreateIdentityCommand(
          'Ana',
          DocumentType.NationalId,
          '123',
          new Date(),
        ),
      );

      const updated = await new UpdateIdentityUseCase(repository).execute(
        new UpdateIdentityCommand(
          created.id,
          'Ana María',
          IdentityStatus.Suspended,
        ),
      );

      expect(updated.fullName).toBe('Ana María');
      expect(updated.status).toBe(IdentityStatus.Suspended);
    });

    it('throws NotFoundException for an unknown id', async () => {
      await expect(
        new UpdateIdentityUseCase(repository).execute(
          new UpdateIdentityCommand('unknown-id', 'New Name'),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('DeleteIdentityUseCase', () => {
    it('deletes an existing Identity', async () => {
      const created = await new CreateIdentityUseCase(repository).execute(
        new CreateIdentityCommand(
          'Ana',
          DocumentType.NationalId,
          '123',
          new Date(),
        ),
      );

      await new DeleteIdentityUseCase(repository).execute(
        new DeleteIdentityCommand(created.id),
      );

      await expect(
        new GetIdentityUseCase(repository).execute(
          new GetIdentityQuery(created.id),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException for an unknown id', async () => {
      await expect(
        new DeleteIdentityUseCase(repository).execute(
          new DeleteIdentityCommand('unknown-id'),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('ListIdentityUseCase', () => {
    it('paginates results', async () => {
      const createUseCase = new CreateIdentityUseCase(repository);
      await createUseCase.execute(
        new CreateIdentityCommand(
          'A',
          DocumentType.NationalId,
          '1',
          new Date(),
        ),
      );
      await createUseCase.execute(
        new CreateIdentityCommand(
          'B',
          DocumentType.NationalId,
          '2',
          new Date(),
        ),
      );

      const page = await new ListIdentityUseCase(repository).execute(
        new ListIdentityQuery(1, 1),
      );

      expect(page.items).toHaveLength(1);
      expect(page.total).toBe(2);
    });
  });

  describe('SearchIdentityUseCase', () => {
    it('finds Identities by fullName', async () => {
      await new CreateIdentityUseCase(repository).execute(
        new CreateIdentityCommand(
          'Special Name',
          DocumentType.NationalId,
          '999',
          new Date(),
        ),
      );

      const results = await new SearchIdentityUseCase(repository).execute(
        new SearchIdentityQuery('special'),
      );

      expect(results).toHaveLength(1);
      expect(results[0].fullName).toBe('Special Name');
    });
  });
});
