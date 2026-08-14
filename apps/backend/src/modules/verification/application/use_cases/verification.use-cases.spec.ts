import { Role } from '../../../../common/auth/role.enum';
import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
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
  let owner: AuthenticatedUser;
  let outsider: AuthenticatedUser;
  let admin: AuthenticatedUser;

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
    owner = { id: identityId, role: Role.Customer };
    outsider = { id: IdentityId.create().value, role: Role.Customer };
    admin = { id: IdentityId.create().value, role: Role.Admin };
  });

  function createUseCase() {
    return new CreateVerificationUseCase(repository, identityRepository);
  }

  async function createForOwner(
    type: VerificationType = VerificationType.Document,
  ) {
    return createUseCase().execute(
      new CreateVerificationCommand(identityId, type, owner),
    );
  }

  describe('CreateVerificationUseCase', () => {
    it('creates a Verification in Pending status', async () => {
      const dto = await createForOwner();

      expect(dto.identityId).toBe(identityId);
      expect(dto.status).toBe(VerificationStatus.Pending);
      expect(dto.verifiedAt).toBeNull();
    });

    it('throws NotFoundException when the Identity does not exist', async () => {
      await expect(
        createUseCase().execute(
          new CreateVerificationCommand(
            'unknown-identity',
            VerificationType.Document,
            { id: 'unknown-identity', role: Role.Customer },
          ),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('rejects an invalid type', async () => {
      await expect(
        createUseCase().execute(
          new CreateVerificationCommand(
            identityId,
            'NOT_A_TYPE' as VerificationType,
            owner,
          ),
        ),
      ).rejects.toThrow(ValidationException);
    });

    it('throws ForbiddenException when creating one for another Identity', async () => {
      await expect(
        createUseCase().execute(
          new CreateVerificationCommand(
            identityId,
            VerificationType.Document,
            outsider,
          ),
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('GetVerificationUseCase', () => {
    it('throws NotFoundException when it does not exist', async () => {
      await expect(
        new GetVerificationUseCase(repository).execute(
          new GetVerificationQuery('unknown-id', owner),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('returns the Verification to its owner', async () => {
      const created = await createForOwner();

      const found = await new GetVerificationUseCase(repository).execute(
        new GetVerificationQuery(created.id, owner),
      );
      expect(found.id).toBe(created.id);
    });

    it('throws ForbiddenException for anybody else', async () => {
      const created = await createForOwner();

      await expect(
        new GetVerificationUseCase(repository).execute(
          new GetVerificationQuery(created.id, outsider),
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('returns any Verification to an Admin', async () => {
      const created = await createForOwner();

      const found = await new GetVerificationUseCase(repository).execute(
        new GetVerificationQuery(created.id, admin),
      );
      expect(found.id).toBe(created.id);
    });
  });

  describe('UpdateVerificationUseCase', () => {
    it('lets an Admin approve a Verification', async () => {
      const created = await createForOwner();

      const updated = await new UpdateVerificationUseCase(repository).execute(
        new UpdateVerificationCommand(
          created.id,
          VerificationStatus.Approved,
          admin,
        ),
      );

      expect(updated.status).toBe(VerificationStatus.Approved);
    });

    it('refuses to let the owner approve their own Verification', async () => {
      const created = await createForOwner();

      await expect(
        new UpdateVerificationUseCase(repository).execute(
          new UpdateVerificationCommand(
            created.id,
            VerificationStatus.Approved,
            owner,
          ),
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('lets the owner resubmit a rejected Verification as PENDING', async () => {
      const created = await createForOwner();
      await new UpdateVerificationUseCase(repository).execute(
        new UpdateVerificationCommand(
          created.id,
          VerificationStatus.Rejected,
          admin,
        ),
      );

      const resubmitted = await new UpdateVerificationUseCase(
        repository,
      ).execute(
        new UpdateVerificationCommand(
          created.id,
          VerificationStatus.Pending,
          owner,
        ),
      );

      expect(resubmitted.status).toBe(VerificationStatus.Pending);
    });

    it('refuses a PENDING transition from a status other than REJECTED', async () => {
      const created = await createForOwner();

      await expect(
        new UpdateVerificationUseCase(repository).execute(
          new UpdateVerificationCommand(
            created.id,
            VerificationStatus.Pending,
            owner,
          ),
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('throws ForbiddenException for a caller who is neither owner nor Admin', async () => {
      const created = await createForOwner();

      await expect(
        new UpdateVerificationUseCase(repository).execute(
          new UpdateVerificationCommand(created.id, undefined, outsider),
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('throws NotFoundException for an unknown id', async () => {
      await expect(
        new UpdateVerificationUseCase(repository).execute(
          new UpdateVerificationCommand(
            'unknown-id',
            VerificationStatus.Approved,
            admin,
          ),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('UploadVerificationDocumentUseCase', () => {
    it('sets documentPath on an existing Verification', async () => {
      const created = await createForOwner(VerificationType.CriminalRecord);
      expect(created.documentPath).toBeNull();

      const updated = await new UploadVerificationDocumentUseCase(
        repository,
      ).execute(
        new UploadVerificationDocumentCommand(
          created.id,
          `uploads/verifications/${created.id}/record.pdf`,
          owner,
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
            owner,
          ),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ValidationException when documentPath is blank', async () => {
      const created = await createForOwner();

      await expect(
        new UploadVerificationDocumentUseCase(repository).execute(
          new UploadVerificationDocumentCommand(created.id, '  ', owner),
        ),
      ).rejects.toThrow(ValidationException);
    });

    it('throws ForbiddenException when uploading to somebody else’s Verification', async () => {
      const created = await createForOwner();

      await expect(
        new UploadVerificationDocumentUseCase(repository).execute(
          new UploadVerificationDocumentCommand(
            created.id,
            `uploads/verifications/${created.id}/record.pdf`,
            outsider,
          ),
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('ListVerificationUseCase', () => {
    it('paginates results', async () => {
      await createForOwner(VerificationType.Document);
      await createForOwner(VerificationType.Facial);

      const page = await new ListVerificationUseCase(repository).execute(
        new ListVerificationQuery(owner, 1, 1),
      );

      expect(page.items).toHaveLength(1);
      expect(page.total).toBe(2);
    });

    it('hides the Verifications of other Identities', async () => {
      await createForOwner();

      const page = await new ListVerificationUseCase(repository).execute(
        new ListVerificationQuery(outsider),
      );

      expect(page.items).toHaveLength(0);
      expect(page.total).toBe(0);
    });

    it('lists every Verification for an Admin', async () => {
      await createForOwner();

      const page = await new ListVerificationUseCase(repository).execute(
        new ListVerificationQuery(admin),
      );

      expect(page.total).toBe(1);
    });
  });

  describe('SearchVerificationUseCase', () => {
    it('finds Verifications by type', async () => {
      await createForOwner(VerificationType.Facial);

      const results = await new SearchVerificationUseCase(repository).execute(
        new SearchVerificationQuery('facial', owner),
      );

      expect(results).toHaveLength(1);
    });

    it('does not leak the Verifications of other Identities', async () => {
      await createForOwner(VerificationType.Facial);

      const results = await new SearchVerificationUseCase(repository).execute(
        new SearchVerificationQuery('facial', outsider),
      );

      expect(results).toHaveLength(0);
    });
  });
});
