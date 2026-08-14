import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { Role } from '../../../../common/auth/role.enum';
import { BusinessRuleException } from '../../../core/domain/exceptions/business-rule.exception';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { Identity } from '../../../identity/domain/entities/identity.entity';
import { DocumentType } from '../../../identity/domain/value-objects/document-type.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { IdentityStatus } from '../../../identity/domain/value-objects/identity-status.value-object';
import { InMemoryIdentityRepository } from '../../../identity/application/use_cases/test-support/in-memory-identity.repository';
import { Profile } from '../../../profiles/domain/entities/profile.entity';
import { ProfileId } from '../../../profiles/domain/value-objects/profile-id.value-object';
import { ProfileVisibility } from '../../../profiles/domain/value-objects/profile-visibility.value-object';
import { ProfileStatus } from '../../../profiles/domain/value-objects/profile-status.value-object';
import { InMemoryProfileRepository } from '../../../profiles/application/use_cases/test-support/in-memory-profile.repository';
import { ProviderType } from '../../domain/value-objects/provider-type.value-object';
import { ProviderExperience } from '../../domain/value-objects/provider-experience.value-object';
import { ProviderStatus } from '../../domain/value-objects/provider-status.value-object';
import { CreateProviderCommand } from '../commands/create-provider.command';
import { DeleteProviderCommand } from '../commands/delete-provider.command';
import { UpdateProviderCommand } from '../commands/update-provider.command';
import { GetProviderQuery } from '../queries/get-provider.query';
import { ListProviderQuery } from '../queries/list-provider.query';
import { SearchProviderQuery } from '../queries/search-provider.query';
import { InMemoryProviderRepository } from './test-support/in-memory-provider.repository';
import { CreateProviderUseCase } from './create-provider.use-case';
import { GetProviderUseCase } from './get-provider.use-case';
import { UpdateProviderUseCase } from './update-provider.use-case';
import { DeleteProviderUseCase } from './delete-provider.use-case';
import { ListProviderUseCase } from './list-provider.use-case';
import { SearchProviderUseCase } from './search-provider.use-case';

describe('Provider use cases', () => {
  let repository: InMemoryProviderRepository;
  let identityRepository: InMemoryIdentityRepository;
  let profileRepository: InMemoryProfileRepository;
  let identityId: string;
  let profileId: string;

  beforeEach(async () => {
    repository = new InMemoryProviderRepository();
    identityRepository = new InMemoryIdentityRepository();
    profileRepository = new InMemoryProfileRepository();

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

    const profile = new Profile(ProfileId.create(), {
      identityId: identity.id,
      displayName: 'Owner',
      avatarUrl: null,
      bio: null,
      visibility: ProfileVisibility.Public,
      status: ProfileStatus.Active,
      createdAt: now,
      updatedAt: now,
    });
    await profileRepository.save(profile);
    profileId = profile.id.value;
  });

  /**
   * Most cases below exercise behaviour that is orthogonal to the
   * Etapa 18 authorization rules, so they run as an `Admin` — the one
   * caller allowed through every branch. The ownership and
   * status-transition rules themselves get their own dedicated cases.
   */
  const admin: AuthenticatedUser = { id: 'admin-identity', role: Role.Admin };
  const owner = (): AuthenticatedUser => ({
    id: identityId,
    role: Role.Provider,
  });
  const stranger: AuthenticatedUser = {
    id: 'someone-else',
    role: Role.Customer,
  };

  function createCommand() {
    return new CreateProviderCommand(
      identityId,
      profileId,
      ProviderType.Independent,
      ProviderExperience.Intermediate,
      'Experienced handyman',
      5,
    );
  }

  describe('CreateProviderUseCase', () => {
    it('creates a Provider in Pending status', async () => {
      const useCase = new CreateProviderUseCase(
        repository,
        identityRepository,
        profileRepository,
      );
      const dto = await useCase.execute(createCommand(), owner());

      expect(dto.identityId).toBe(identityId);
      expect(dto.providerProfileId).toBe(profileId);
      expect(dto.status).toBe(ProviderStatus.Pending);
    });

    it('throws NotFoundException when the Identity does not exist', async () => {
      const useCase = new CreateProviderUseCase(
        repository,
        identityRepository,
        profileRepository,
      );
      await expect(
        useCase.execute(
          new CreateProviderCommand(
            'unknown-identity',
            profileId,
            ProviderType.Independent,
            ProviderExperience.Intermediate,
            'bio',
            5,
          ),
          admin,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException when the Profile does not exist', async () => {
      const useCase = new CreateProviderUseCase(
        repository,
        identityRepository,
        profileRepository,
      );
      await expect(
        useCase.execute(
          new CreateProviderCommand(
            identityId,
            'unknown-profile',
            ProviderType.Independent,
            ProviderExperience.Intermediate,
            'bio',
            5,
          ),
          owner(),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('rejects a negative yearsOfExperience', async () => {
      const useCase = new CreateProviderUseCase(
        repository,
        identityRepository,
        profileRepository,
      );
      await expect(
        useCase.execute(
          new CreateProviderCommand(
            identityId,
            profileId,
            ProviderType.Independent,
            ProviderExperience.Intermediate,
            'bio',
            -1,
          ),
          owner(),
        ),
      ).rejects.toThrow(ValidationException);
    });

    it('throws BusinessRuleException when the Identity already has a Provider record', async () => {
      const useCase = new CreateProviderUseCase(
        repository,
        identityRepository,
        profileRepository,
      );
      await useCase.execute(createCommand(), owner());

      await expect(useCase.execute(createCommand(), owner())).rejects.toThrow(
        BusinessRuleException,
      );
    });

    it('refuses to create a Provider for another Identity', async () => {
      const useCase = new CreateProviderUseCase(
        repository,
        identityRepository,
        profileRepository,
      );

      await expect(
        useCase.execute(createCommand(), stranger),
      ).rejects.toThrow(ForbiddenException);
    });

    it('lets an Admin create a Provider on behalf of another Identity', async () => {
      const useCase = new CreateProviderUseCase(
        repository,
        identityRepository,
        profileRepository,
      );

      const dto = await useCase.execute(createCommand(), admin);

      expect(dto.identityId).toBe(identityId);
    });
  });

  describe('GetProviderUseCase', () => {
    it('throws NotFoundException when it does not exist', async () => {
      await expect(
        new GetProviderUseCase(repository).execute(
          new GetProviderQuery('unknown-id'),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('UpdateProviderUseCase', () => {
    it('updates biography, experience and status', async () => {
      const created = await new CreateProviderUseCase(
        repository,
        identityRepository,
        profileRepository,
      ).execute(createCommand(), owner());

      const updated = await new UpdateProviderUseCase(repository).execute(
        new UpdateProviderCommand(
          created.id,
          'New bio',
          ProviderExperience.Expert,
          ProviderStatus.Inactive,
        ),
        admin,
      );

      expect(updated.biography).toBe('New bio');
      expect(updated.experience).toBe(ProviderExperience.Expert);
      expect(updated.status).toBe(ProviderStatus.Inactive);
    });

    it('throws NotFoundException for an unknown id', async () => {
      await expect(
        new UpdateProviderUseCase(repository).execute(
          new UpdateProviderCommand('unknown-id', 'bio'),
          admin,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('lets the owner edit non-status fields', async () => {
      const created = await new CreateProviderUseCase(
        repository,
        identityRepository,
        profileRepository,
      ).execute(createCommand(), owner());

      const updated = await new UpdateProviderUseCase(repository).execute(
        new UpdateProviderCommand(
          created.id,
          'Owner-edited bio',
          ProviderExperience.Expert,
        ),
        owner(),
      );

      expect(updated.biography).toBe('Owner-edited bio');
      expect(updated.status).toBe(ProviderStatus.Pending);
    });

    it('refuses to let a non-admin owner self-approve as ACTIVE', async () => {
      const created = await new CreateProviderUseCase(
        repository,
        identityRepository,
        profileRepository,
      ).execute(createCommand(), owner());

      await expect(
        new UpdateProviderUseCase(repository).execute(
          new UpdateProviderCommand(
            created.id,
            undefined,
            undefined,
            ProviderStatus.Active,
          ),
          owner(),
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('lets the owner resubmit a rejected application (REJECTED to PENDING)', async () => {
      const created = await new CreateProviderUseCase(
        repository,
        identityRepository,
        profileRepository,
      ).execute(createCommand(), owner());

      await new UpdateProviderUseCase(repository).execute(
        new UpdateProviderCommand(
          created.id,
          undefined,
          undefined,
          ProviderStatus.Rejected,
        ),
        admin,
      );

      const resubmitted = await new UpdateProviderUseCase(repository).execute(
        new UpdateProviderCommand(
          created.id,
          undefined,
          undefined,
          ProviderStatus.Pending,
        ),
        owner(),
      );

      expect(resubmitted.status).toBe(ProviderStatus.Pending);
    });

    it('refuses a PENDING status write when the Provider was not rejected', async () => {
      const created = await new CreateProviderUseCase(
        repository,
        identityRepository,
        profileRepository,
      ).execute(createCommand(), owner());

      await expect(
        new UpdateProviderUseCase(repository).execute(
          new UpdateProviderCommand(
            created.id,
            undefined,
            undefined,
            ProviderStatus.Pending,
          ),
          owner(),
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('refuses an update from a caller who is neither owner nor admin', async () => {
      const created = await new CreateProviderUseCase(
        repository,
        identityRepository,
        profileRepository,
      ).execute(createCommand(), owner());

      await expect(
        new UpdateProviderUseCase(repository).execute(
          new UpdateProviderCommand(created.id, 'Hijacked bio'),
          stranger,
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('DeleteProviderUseCase', () => {
    it('deletes an existing Provider', async () => {
      const created = await new CreateProviderUseCase(
        repository,
        identityRepository,
        profileRepository,
      ).execute(createCommand(), owner());

      await new DeleteProviderUseCase(repository).execute(
        new DeleteProviderCommand(created.id),
        owner(),
      );

      await expect(
        new GetProviderUseCase(repository).execute(
          new GetProviderQuery(created.id),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException for an unknown id', async () => {
      await expect(
        new DeleteProviderUseCase(repository).execute(
          new DeleteProviderCommand('unknown-id'),
          admin,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('refuses to delete a Provider owned by someone else', async () => {
      const created = await new CreateProviderUseCase(
        repository,
        identityRepository,
        profileRepository,
      ).execute(createCommand(), owner());

      await expect(
        new DeleteProviderUseCase(repository).execute(
          new DeleteProviderCommand(created.id),
          stranger,
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('ListProviderUseCase', () => {
    it('paginates results', async () => {
      const identity2 = new Identity(IdentityId.create(), {
        fullName: 'Second Owner',
        documentType: DocumentType.NationalId,
        documentNumber: '456',
        birthDate: new Date(),
        status: IdentityStatus.Active,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await identityRepository.save(identity2);
      const profile2 = new Profile(ProfileId.create(), {
        identityId: identity2.id,
        displayName: 'Second Owner',
        avatarUrl: null,
        bio: null,
        visibility: ProfileVisibility.Public,
        status: ProfileStatus.Active,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await profileRepository.save(profile2);

      const createUseCase = new CreateProviderUseCase(
        repository,
        identityRepository,
        profileRepository,
      );
      await createUseCase.execute(createCommand(), owner());
      await createUseCase.execute(
        new CreateProviderCommand(
          identity2.id.value,
          profile2.id.value,
          ProviderType.Company,
          ProviderExperience.Expert,
          'Second bio',
          10,
        ),
        { id: identity2.id.value, role: Role.Provider },
      );

      const page = await new ListProviderUseCase(repository).execute(
        new ListProviderQuery(1, 1),
      );

      expect(page.items).toHaveLength(1);
      expect(page.total).toBe(2);
    });
  });

  describe('SearchProviderUseCase', () => {
    it('finds Providers by biography', async () => {
      await new CreateProviderUseCase(
        repository,
        identityRepository,
        profileRepository,
      ).execute(
        new CreateProviderCommand(
          identityId,
          profileId,
          ProviderType.Independent,
          ProviderExperience.Intermediate,
          'Special marker biography',
          5,
        ),
        owner(),
      );

      const results = await new SearchProviderUseCase(repository).execute(
        new SearchProviderQuery('special marker'),
      );

      expect(results).toHaveLength(1);
    });
  });
});
