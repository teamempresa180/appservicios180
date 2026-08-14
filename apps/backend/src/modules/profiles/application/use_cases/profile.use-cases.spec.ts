import { Role } from '../../../../common/auth/role.enum';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
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
import { UpdateProfileAvatarCommand } from '../commands/update-profile-avatar.command';
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
import { UpdateProfileAvatarUseCase } from './update-profile-avatar.use-case';

describe('Profile use cases', () => {
  let repository: InMemoryProfileRepository;
  let identityRepository: InMemoryIdentityRepository;
  let identityId: string;

  /** The caller in the happy path is always the Identity that owns the
   *  Profile under test — every write is owner-only since Etapa 18. */
  const createCommand = (
    displayName: string,
    visibility: ProfileVisibility = ProfileVisibility.Public,
    owner: string = identityId,
    caller: string = owner,
  ): CreateProfileCommand =>
    new CreateProfileCommand(
      owner,
      caller,
      Role.Customer,
      displayName,
      null,
      null,
      visibility,
    );

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
      const dto = await useCase.execute(createCommand('Ana María'));

      expect(dto.identityId).toBe(identityId);
      expect(dto.displayName).toBe('Ana María');
      expect(dto.status).toBe(ProfileStatus.Active);
    });

    it('throws NotFoundException when the Identity does not exist', async () => {
      const useCase = new CreateProfileUseCase(repository, identityRepository);
      await expect(
        useCase.execute(
          createCommand(
            'Ana',
            ProfileVisibility.Public,
            'unknown-identity',
            'unknown-identity',
          ),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException when creating a Profile for another Identity', async () => {
      const useCase = new CreateProfileUseCase(repository, identityRepository);
      await expect(
        useCase.execute(
          createCommand(
            'Impostor',
            ProfileVisibility.Public,
            identityId,
            'someone-else',
          ),
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('rejects a blank displayName', async () => {
      const useCase = new CreateProfileUseCase(repository, identityRepository);
      await expect(useCase.execute(createCommand('  '))).rejects.toThrow(
        ValidationException,
      );
    });

    it('rejects an invalid visibility', async () => {
      const useCase = new CreateProfileUseCase(repository, identityRepository);
      await expect(
        useCase.execute(
          createCommand('Ana', 'NOT_A_VISIBILITY' as ProfileVisibility),
        ),
      ).rejects.toThrow(ValidationException);
    });
  });

  describe('GetProfileUseCase', () => {
    it('returns the Profile to its owner', async () => {
      const created = await new CreateProfileUseCase(
        repository,
        identityRepository,
      ).execute(createCommand('Ana'));

      const found = await new GetProfileUseCase(repository).execute(
        new GetProfileQuery(created.id, identityId, Role.Customer),
      );
      expect(found.id).toBe(created.id);
    });

    it('returns a Public Profile to any authenticated caller', async () => {
      const created = await new CreateProfileUseCase(
        repository,
        identityRepository,
      ).execute(createCommand('Ana', ProfileVisibility.Public));

      const found = await new GetProfileUseCase(repository).execute(
        new GetProfileQuery(created.id, 'someone-else', Role.Customer),
      );
      expect(found.id).toBe(created.id);
    });

    it('throws ForbiddenException for another Identity’s Private Profile', async () => {
      const created = await new CreateProfileUseCase(
        repository,
        identityRepository,
      ).execute(createCommand('Ana', ProfileVisibility.Private));

      await expect(
        new GetProfileUseCase(repository).execute(
          new GetProfileQuery(created.id, 'someone-else', Role.Customer),
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('returns a Private Profile to its own owner', async () => {
      const created = await new CreateProfileUseCase(
        repository,
        identityRepository,
      ).execute(createCommand('Ana', ProfileVisibility.Private));

      const found = await new GetProfileUseCase(repository).execute(
        new GetProfileQuery(created.id, identityId, Role.Customer),
      );
      expect(found.id).toBe(created.id);
    });

    it('throws NotFoundException when it does not exist', async () => {
      await expect(
        new GetProfileUseCase(repository).execute(
          new GetProfileQuery('unknown-id', identityId, Role.Customer),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('UpdateProfileUseCase', () => {
    it('updates displayName, visibility and status', async () => {
      const created = await new CreateProfileUseCase(
        repository,
        identityRepository,
      ).execute(createCommand('Ana'));

      const updated = await new UpdateProfileUseCase(repository).execute(
        new UpdateProfileCommand(
          created.id,
          identityId,
          Role.Customer,
          'Ana María',
          ProfileVisibility.Private,
          ProfileStatus.Inactive,
        ),
      );

      expect(updated.displayName).toBe('Ana María');
      expect(updated.visibility).toBe(ProfileVisibility.Private);
      expect(updated.status).toBe(ProfileStatus.Inactive);
    });

    it('throws ForbiddenException when the Profile belongs to another Identity', async () => {
      const created = await new CreateProfileUseCase(
        repository,
        identityRepository,
      ).execute(createCommand('Ana'));

      await expect(
        new UpdateProfileUseCase(repository).execute(
          new UpdateProfileCommand(
            created.id,
            'someone-else',
            Role.Customer,
            'Hijacked',
          ),
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('throws NotFoundException for an unknown id', async () => {
      await expect(
        new UpdateProfileUseCase(repository).execute(
          new UpdateProfileCommand(
            'unknown-id',
            identityId,
            Role.Customer,
            'New Name',
          ),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('UpdateProfileAvatarUseCase', () => {
    it('sets avatarUrl on an existing Profile', async () => {
      const created = await new CreateProfileUseCase(
        repository,
        identityRepository,
      ).execute(createCommand('Ana'));
      expect(created.avatarUrl).toBeNull();

      const updated = await new UpdateProfileAvatarUseCase(repository).execute(
        new UpdateProfileAvatarCommand(
          created.id,
          identityId,
          Role.Customer,
          `uploads/profiles/${created.id}/avatar.png`,
        ),
      );

      expect(updated.avatarUrl).toBe(
        `uploads/profiles/${created.id}/avatar.png`,
      );
      expect(updated.displayName).toBe('Ana');
    });

    it('throws ForbiddenException when the Profile belongs to another Identity', async () => {
      const created = await new CreateProfileUseCase(
        repository,
        identityRepository,
      ).execute(createCommand('Ana'));

      await expect(
        new UpdateProfileAvatarUseCase(repository).execute(
          new UpdateProfileAvatarCommand(
            created.id,
            'someone-else',
            Role.Customer,
            `uploads/profiles/${created.id}/avatar.png`,
          ),
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('throws NotFoundException for an unknown id', async () => {
      await expect(
        new UpdateProfileAvatarUseCase(repository).execute(
          new UpdateProfileAvatarCommand(
            'unknown-id',
            identityId,
            Role.Customer,
            'uploads/profiles/unknown-id/avatar.png',
          ),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ValidationException when avatarUrl is blank', async () => {
      const created = await new CreateProfileUseCase(
        repository,
        identityRepository,
      ).execute(createCommand('Ana'));

      await expect(
        new UpdateProfileAvatarUseCase(repository).execute(
          new UpdateProfileAvatarCommand(
            created.id,
            identityId,
            Role.Customer,
            '  ',
          ),
        ),
      ).rejects.toThrow(ValidationException);
    });
  });

  describe('DeleteProfileUseCase', () => {
    it('deletes an existing Profile', async () => {
      const created = await new CreateProfileUseCase(
        repository,
        identityRepository,
      ).execute(createCommand('Ana'));

      await new DeleteProfileUseCase(repository).execute(
        new DeleteProfileCommand(created.id, identityId, Role.Customer),
      );

      await expect(
        new GetProfileUseCase(repository).execute(
          new GetProfileQuery(created.id, identityId, Role.Customer),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException when the Profile belongs to another Identity', async () => {
      const created = await new CreateProfileUseCase(
        repository,
        identityRepository,
      ).execute(createCommand('Ana'));

      await expect(
        new DeleteProfileUseCase(repository).execute(
          new DeleteProfileCommand(created.id, 'someone-else', Role.Customer),
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('throws NotFoundException for an unknown id', async () => {
      await expect(
        new DeleteProfileUseCase(repository).execute(
          new DeleteProfileCommand('unknown-id', identityId, Role.Customer),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('ListProfileUseCase', () => {
    it('paginates the caller’s own Profiles', async () => {
      const createUseCase = new CreateProfileUseCase(
        repository,
        identityRepository,
      );
      await createUseCase.execute(createCommand('A'));
      await createUseCase.execute(createCommand('B'));

      const page = await new ListProfileUseCase(repository).execute(
        new ListProfileQuery(identityId, Role.Customer, 1, 1),
      );

      expect(page.items).toHaveLength(1);
      expect(page.total).toBe(2);
    });

    it('does not return Profiles owned by another Identity', async () => {
      await new CreateProfileUseCase(repository, identityRepository).execute(
        createCommand('A'),
      );

      const page = await new ListProfileUseCase(repository).execute(
        new ListProfileQuery('someone-else', Role.Customer),
      );

      expect(page.items).toHaveLength(0);
      expect(page.total).toBe(0);
    });
  });

  describe('SearchProfileUseCase', () => {
    it('finds Profiles by displayName', async () => {
      await new CreateProfileUseCase(repository, identityRepository).execute(
        createCommand('Special Name'),
      );

      const results = await new SearchProfileUseCase(repository).execute(
        new SearchProfileQuery('special'),
      );

      expect(results).toHaveLength(1);
      expect(results[0].displayName).toBe('Special Name');
    });
  });
});
