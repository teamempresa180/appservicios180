import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { Role } from '../../../../common/auth/role.enum';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { Identity } from '../../../identity/domain/entities/identity.entity';
import { DocumentType } from '../../../identity/domain/value-objects/document-type.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { IdentityStatus } from '../../../identity/domain/value-objects/identity-status.value-object';
import { InMemoryIdentityRepository } from '../../../identity/application/use_cases/test-support/in-memory-identity.repository';
import { AuditActionType } from '../../domain/value-objects/audit-action-type.value-object';
import { CreateAuditRecordCommand } from '../commands/create-audit-record.command';
import { GetAuditQuery } from '../queries/get-audit.query';
import { ListAuditQuery } from '../queries/list-audit.query';
import { SearchAuditQuery } from '../queries/search-audit.query';
import { InMemoryAuditRepository } from './test-support/in-memory-audit.repository';
import { CreateAuditRecordUseCase } from './create-audit-record.use-case';
import { GetAuditUseCase } from './get-audit.use-case';
import { ListAuditUseCase } from './list-audit.use-case';
import { SearchAuditUseCase } from './search-audit.use-case';

describe('Audit use cases', () => {
  let repository: InMemoryAuditRepository;
  let identityRepository: InMemoryIdentityRepository;
  let identityId: string;
  let caller: AuthenticatedUser;

  beforeEach(async () => {
    repository = new InMemoryAuditRepository();
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
    caller = { id: identityId, role: Role.Customer };
  });

  describe('CreateAuditRecordUseCase', () => {
    it('creates an Audit record with occurredAt set to now', async () => {
      const useCase = new CreateAuditRecordUseCase(
        repository,
        identityRepository,
      );
      const dto = await useCase.execute(
        new CreateAuditRecordCommand(
          caller,
          identityId,
          AuditActionType.LoggedIn,
          'User logged in',
        ),
      );

      expect(dto.identityId).toBe(identityId);
      expect(dto.actionType).toBe(AuditActionType.LoggedIn);
      expect(dto.occurredAt).toBeInstanceOf(Date);
    });

    it('throws NotFoundException when the Identity does not exist', async () => {
      const useCase = new CreateAuditRecordUseCase(
        repository,
        identityRepository,
      );
      const unknownCaller: AuthenticatedUser = {
        id: 'unknown-identity',
        role: Role.Customer,
      };
      await expect(
        useCase.execute(
          new CreateAuditRecordCommand(
            unknownCaller,
            'unknown-identity',
            AuditActionType.LoggedIn,
            'User logged in',
          ),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('rejects a blank description', async () => {
      const useCase = new CreateAuditRecordUseCase(
        repository,
        identityRepository,
      );
      await expect(
        useCase.execute(
          new CreateAuditRecordCommand(
            caller,
            identityId,
            AuditActionType.LoggedIn,
            '  ',
          ),
        ),
      ).rejects.toThrow(ValidationException);
    });

    it('rejects an invalid actionType', async () => {
      const useCase = new CreateAuditRecordUseCase(
        repository,
        identityRepository,
      );
      await expect(
        useCase.execute(
          new CreateAuditRecordCommand(
            caller,
            identityId,
            'NOT_A_TYPE' as AuditActionType,
            'User logged in',
          ),
        ),
      ).rejects.toThrow(ValidationException);
    });
  });

  describe('GetAuditUseCase', () => {
    it('throws NotFoundException when it does not exist', async () => {
      await expect(
        new GetAuditUseCase(repository).execute(
          new GetAuditQuery(caller, 'unknown-id'),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('ListAuditUseCase', () => {
    it('paginates results', async () => {
      const createUseCase = new CreateAuditRecordUseCase(
        repository,
        identityRepository,
      );
      await createUseCase.execute(
        new CreateAuditRecordCommand(
          caller,
          identityId,
          AuditActionType.Created,
          'Record A',
        ),
      );
      await createUseCase.execute(
        new CreateAuditRecordCommand(
          caller,
          identityId,
          AuditActionType.Updated,
          'Record B',
        ),
      );

      const page = await new ListAuditUseCase(repository).execute(
        new ListAuditQuery(caller, 1, 1),
      );

      expect(page.items).toHaveLength(1);
      expect(page.total).toBe(2);
    });
  });

  describe('ownership', () => {
    const intruder: AuthenticatedUser = {
      id: 'another-identity',
      role: Role.Customer,
    };
    const admin: AuthenticatedUser = {
      id: 'admin-identity',
      role: Role.Admin,
    };

    async function seedOwnedRecord(): Promise<string> {
      const created = await new CreateAuditRecordUseCase(
        repository,
        identityRepository,
      ).execute(
        new CreateAuditRecordCommand(
          caller,
          identityId,
          AuditActionType.LoggedIn,
          'Owner logged in',
        ),
      );
      return created.id;
    }

    it('CreateAuditRecordUseCase rejects writing into another Identity’s trail', async () => {
      await expect(
        new CreateAuditRecordUseCase(repository, identityRepository).execute(
          new CreateAuditRecordCommand(
            intruder,
            identityId,
            AuditActionType.LoggedIn,
            'Forged entry',
          ),
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('GetAuditUseCase rejects another Identity’s Audit record', async () => {
      const id = await seedOwnedRecord();
      await expect(
        new GetAuditUseCase(repository).execute(
          new GetAuditQuery(intruder, id),
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('ListAuditUseCase hides Audit records owned by another Identity', async () => {
      await seedOwnedRecord();

      const page = await new ListAuditUseCase(repository).execute(
        new ListAuditQuery(intruder),
      );

      expect(page.items).toHaveLength(0);
      expect(page.total).toBe(0);
    });

    it('SearchAuditUseCase hides Audit records owned by another Identity', async () => {
      await seedOwnedRecord();

      const results = await new SearchAuditUseCase(repository).execute(
        new SearchAuditQuery(intruder, 'logged in'),
      );

      expect(results).toHaveLength(0);
    });

    it('an Admin caller reads the whole system’s trail', async () => {
      await seedOwnedRecord();

      const page = await new ListAuditUseCase(repository).execute(
        new ListAuditQuery(admin),
      );

      expect(page.total).toBe(1);
    });

    it('an Admin caller may read a single record from another Identity’s trail', async () => {
      const id = await seedOwnedRecord();

      const dto = await new GetAuditUseCase(repository).execute(
        new GetAuditQuery(admin, id),
      );

      expect(dto.identityId).toBe(identityId);
    });
  });

  describe('SearchAuditUseCase', () => {
    it('finds Audit records by description', async () => {
      await new CreateAuditRecordUseCase(
        repository,
        identityRepository,
      ).execute(
        new CreateAuditRecordCommand(
          caller,
          identityId,
          AuditActionType.Other,
          'Special marker event',
        ),
      );

      const results = await new SearchAuditUseCase(repository).execute(
        new SearchAuditQuery(caller, 'special'),
      );

      expect(results).toHaveLength(1);
    });
  });
});
