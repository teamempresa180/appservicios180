import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { Identity } from '../../../identity/domain/entities/identity.entity';
import { DocumentType } from '../../../identity/domain/value-objects/document-type.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { IdentityStatus } from '../../../identity/domain/value-objects/identity-status.value-object';
import { InMemoryIdentityRepository } from '../../../identity/application/use_cases/test-support/in-memory-identity.repository';
import { ProfileVisibility } from '../../domain/value-objects/profile-visibility.value-object';
import { ProfileStatus } from '../../domain/value-objects/profile-status.value-object';
import { CreateProfileCommand } from '../commands/create-profile.command';
import { DeleteProfileCommand } from '../commands/delete-profile.command';
import { UpdateProfileCommand } from '../commands/update-profile.command';
import { GetProfileQuery } from '../queries/get-profile.query';
import { ListProfileQuery } from '../queries/list-profile.query';
import { SearchProfileQuery } from '../queries/search-profile.query';
import { InMemoryProfileRepository } from './test-support/in-memory-profile.repository';
import { CreateProfileUseCase } from './create-profile.use-case';
import { GetProfileUseCase } from './get-profile.use-case';
import { UpdateProfileUseCase } from './update-profile.use-case';
import { DeleteProfileUseCase } from './delete-profile.use-case';
import { ListProfileUseCase } from './list-profile.use-case';
import { SearchProfileUseCase } from './search-profile.use-case';

describe('Profile use cases', () => {
  let repository: InMemoryProfileRepository;
  let identityRepository: InMemoryIdentityRepository;
  let identityId: string;

  beforeEach(async () => {
    repository = new InMemoryProfileRepository();
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

  describe('CreateProfileUseCase', () => {
    it('creates a Profile in Active status', async () => {
      const useCase = new CreateProfileUseCase(repository, identityRepository);
      const dto = await useCase.execute(
        new CreateProfileCommand(
          identityId,
          'Ana María',
          null,
          null,
          ProfileVisibility.Public,
        ),
      );

      expect(dto.identityId).toBe(identityId);
      expect(dto.displayName).toBe('Ana María');
      expect(dto.status).toBe(ProfileStatus.Active);
    });

    it('throws NotFoundException when the Identity does not exist', async () => {
      const useCase = new CreateProfileUseCase(repository, identityRepository);
      await expect(
        useCase.execute(
          new CreateProfileCommand(
            'unknown-identity',
            'Ana',
            null,
            null,
            ProfileVisibility.Public,
          ),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('rejects a blank displayName', async () => {
      const useCase = new CreateProfileUseCase(repository, identityRepository);
      await expect(
        useCase.execute(
          new CreateProfileCommand(
            identityId,
            '  ',
            null,
            null,
            ProfileVisibility.Public,
          ),
        ),
      ).rejects.toThrow(ValidationException);
    });

    it('rejects an invalid visibility', async () => {
      const useCase = new CreateProfileUseCase(repository, identityRepository);
      await expect(
        useCase.execute(
          new CreateProfileCommand(
            identityId,
            'Ana',
            null,
            null,
            'NOT_A_VISIBILITY' as ProfileVisibility,
          ),
        ),
      ).rejects.toThrow(ValidationException);
    });
  });

  describe('GetProfileUseCase', () => {
    it('returns the Profile when it exists', async () => {
      const created = await new CreateProfileUseCase(
        repository,
        identityRepository,
      ).execute(
        new CreateProfileCommand(
          identityId,
          'Ana',
          null,
          null,
          ProfileVisibility.Public,
        ),
      );

      const found = await new GetProfileUseCase(repository).execute(
        new GetProfileQuery(created.id),
      );
      expect(found.id).toBe(created.id);
    });

    it('throws NotFoundException when it does not exist', async () => {
      await expect(
        new GetProfileUseCase(repository).execute(
          new GetProfileQuery('unknown-id'),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('UpdateProfileUseCase', () => {
    it('updates displayName, visibility and status', async () => {
      const created = await new CreateProfileUseCase(
        repository,
        identityRepository,
      ).execute(
        new CreateProfileCommand(
          identityId,
          'Ana',
          null,
          null,
          ProfileVisibility.Public,
        ),
      );

      const updated = await new UpdateProfileUseCase(repository).execute(
        new UpdateProfileCommand(
          created.id,
          'Ana María',
          ProfileVisibility.Private,
          ProfileStatus.Inactive,
        ),
      );

      expect(updated.displayName).toBe('Ana María');
      expect(updated.visibility).toBe(ProfileVisibility.Private);
      expect(updated.status).toBe(ProfileStatus.Inactive);
    });

    it('throws NotFoundException for an unknown id', async () => {
      await expect(
        new UpdateProfileUseCase(repository).execute(
          new UpdateProfileCommand('unknown-id', 'New Name'),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('DeleteProfileUseCase', () => {
    it('deletes an existing Profile', async () => {
      const created = await new CreateProfileUseCase(
        repository,
        identityRepository,
      ).execute(
        new CreateProfileCommand(
          identityId,
          'Ana',
          null,
          null,
          ProfileVisibility.Public,
        ),
      );

      await new DeleteProfileUseCase(repository).execute(
        new DeleteProfileCommand(created.id),
      );

      await expect(
        new GetProfileUseCase(repository).execute(
          new GetProfileQuery(created.id),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException for an unknown id', async () => {
      await expect(
        new DeleteProfileUseCase(repository).execute(
          new DeleteProfileCommand('unknown-id'),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('ListProfileUseCase', () => {
    it('paginates results', async () => {
      const createUseCase = new CreateProfileUseCase(
        repository,
        identityRepository,
      );
      await createUseCase.execute(
        new CreateProfileCommand(
          identityId,
          'A',
          null,
          null,
          ProfileVisibility.Public,
        ),
      );
      await createUseCase.execute(
        new CreateProfileCommand(
          identityId,
          'B',
          null,
          null,
          ProfileVisibility.Public,
        ),
      );

      const page = await new ListProfileUseCase(repository).execute(
        new ListProfileQuery(1, 1),
      );

      expect(page.items).toHaveLength(1);
      expect(page.total).toBe(2);
    });
  });

  describe('SearchProfileUseCase', () => {
    it('finds Profiles by displayName', async () => {
      await new CreateProfileUseCase(repository, identityRepository).execute(
        new CreateProfileCommand(
          identityId,
          'Special Name',
          null,
          null,
          ProfileVisibility.Public,
        ),
      );

      const results = await new SearchProfileUseCase(repository).execute(
        new SearchProfileQuery('special'),
      );

      expect(results).toHaveLength(1);
      expect(results[0].displayName).toBe('Special Name');
    });
  });
});
