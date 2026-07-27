import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { Identity } from '../../../identity/domain/entities/identity.entity';
import { DocumentType } from '../../../identity/domain/value-objects/document-type.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { IdentityStatus } from '../../../identity/domain/value-objects/identity-status.value-object';
import { InMemoryIdentityRepository } from '../../../identity/application/use_cases/test-support/in-memory-identity.repository';
import { VerificationType } from '../../domain/value-objects/verification-type.value-object';
import { VerificationStatus } from '../../domain/value-objects/verification-status.value-object';
import { CreateVerificationCommand } from '../commands/create-verification.command';
import { UpdateVerificationCommand } from '../commands/update-verification.command';
import { UploadVerificationDocumentCommand } from '../commands/upload-verification-document.command';
import { GetVerificationQuery } from '../queries/get-verification.query';
import { ListVerificationQuery } from '../queries/list-verification.query';
import { SearchVerificationQuery } from '../queries/search-verification.query';
import { InMemoryVerificationRepository } from './test-support/in-memory-verification.repository';
import { CreateVerificationUseCase } from './create-verification.use-case';
import { GetVerificationUseCase } from './get-verification.use-case';
import { UpdateVerificationUseCase } from './update-verification.use-case';
import { ListVerificationUseCase } from './list-verification.use-case';
import { SearchVerificationUseCase } from './search-verification.use-case';
import { UploadVerificationDocumentUseCase } from './upload-verification-document.use-case';

describe('Verification use cases', () => {
  let repository: InMemoryVerificationRepository;
  let identityRepository: InMemoryIdentityRepository;
  let identityId: string;

  beforeEach(async () => {
    repository = new InMemoryVerificationRepository();
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

  describe('CreateVerificationUseCase', () => {
    it('creates a Verification in Pending status', async () => {
      const useCase = new CreateVerificationUseCase(
        repository,
        identityRepository,
      );
      const dto = await useCase.execute(
        new CreateVerificationCommand(identityId, VerificationType.Document),
      );

      expect(dto.identityId).toBe(identityId);
      expect(dto.status).toBe(VerificationStatus.Pending);
      expect(dto.verifiedAt).toBeNull();
    });

    it('throws NotFoundException when the Identity does not exist', async () => {
      const useCase = new CreateVerificationUseCase(
        repository,
        identityRepository,
      );
      await expect(
        useCase.execute(
          new CreateVerificationCommand(
            'unknown-identity',
            VerificationType.Document,
          ),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('rejects an invalid type', async () => {
      const useCase = new CreateVerificationUseCase(
        repository,
        identityRepository,
      );
      await expect(
        useCase.execute(
          new CreateVerificationCommand(
            identityId,
            'NOT_A_TYPE' as VerificationType,
          ),
        ),
      ).rejects.toThrow(ValidationException);
    });
  });

  describe('GetVerificationUseCase', () => {
    it('throws NotFoundException when it does not exist', async () => {
      await expect(
        new GetVerificationUseCase(repository).execute(
          new GetVerificationQuery('unknown-id'),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('UpdateVerificationUseCase', () => {
    it('updates status', async () => {
      const created = await new CreateVerificationUseCase(
        repository,
        identityRepository,
      ).execute(
        new CreateVerificationCommand(identityId, VerificationType.Document),
      );

      const updated = await new UpdateVerificationUseCase(repository).execute(
        new UpdateVerificationCommand(created.id, VerificationStatus.Approved),
      );

      expect(updated.status).toBe(VerificationStatus.Approved);
    });

    it('throws NotFoundException for an unknown id', async () => {
      await expect(
        new UpdateVerificationUseCase(repository).execute(
          new UpdateVerificationCommand(
            'unknown-id',
            VerificationStatus.Approved,
          ),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('UploadVerificationDocumentUseCase', () => {
    it('sets documentPath on an existing Verification', async () => {
      const created = await new CreateVerificationUseCase(
        repository,
        identityRepository,
      ).execute(
        new CreateVerificationCommand(
          identityId,
          VerificationType.CriminalRecord,
        ),
      );
      expect(created.documentPath).toBeNull();

      const updated = await new UploadVerificationDocumentUseCase(
        repository,
      ).execute(
        new UploadVerificationDocumentCommand(
          created.id,
          `uploads/verifications/${created.id}/record.pdf`,
        ),
      );

      expect(updated.documentPath).toBe(
        `uploads/verifications/${created.id}/record.pdf`,
      );
      expect(updated.status).toBe(VerificationStatus.Pending);
    });

    it('throws NotFoundException for an unknown id', async () => {
      await expect(
        new UploadVerificationDocumentUseCase(repository).execute(
          new UploadVerificationDocumentCommand(
            'unknown-id',
            'uploads/verifications/unknown-id/record.pdf',
          ),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ValidationException when documentPath is blank', async () => {
      const created = await new CreateVerificationUseCase(
        repository,
        identityRepository,
      ).execute(
        new CreateVerificationCommand(identityId, VerificationType.Document),
      );

      await expect(
        new UploadVerificationDocumentUseCase(repository).execute(
          new UploadVerificationDocumentCommand(created.id, '  '),
        ),
      ).rejects.toThrow(ValidationException);
    });
  });

  describe('ListVerificationUseCase', () => {
    it('paginates results', async () => {
      const createUseCase = new CreateVerificationUseCase(
        repository,
        identityRepository,
      );
      await createUseCase.execute(
        new CreateVerificationCommand(identityId, VerificationType.Document),
      );
      await createUseCase.execute(
        new CreateVerificationCommand(identityId, VerificationType.Facial),
      );

      const page = await new ListVerificationUseCase(repository).execute(
        new ListVerificationQuery(1, 1),
      );

      expect(page.items).toHaveLength(1);
      expect(page.total).toBe(2);
    });
  });

  describe('SearchVerificationUseCase', () => {
    it('finds Verifications by type', async () => {
      await new CreateVerificationUseCase(
        repository,
        identityRepository,
      ).execute(
        new CreateVerificationCommand(identityId, VerificationType.Facial),
      );

      const results = await new SearchVerificationUseCase(repository).execute(
        new SearchVerificationQuery('facial'),
      );

      expect(results).toHaveLength(1);
    });
  });
});
