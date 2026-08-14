import { ProfileController } from './profile.controller';
import { CreateProfileUseCase } from '../../application/use_cases/create-profile.use-case';
import { UpdateProfileUseCase } from '../../application/use_cases/update-profile.use-case';
import { DeleteProfileUseCase } from '../../application/use_cases/delete-profile.use-case';
import { GetProfileUseCase } from '../../application/use_cases/get-profile.use-case';
import { ListProfileUseCase } from '../../application/use_cases/list-profile.use-case';
import { SearchProfileUseCase } from '../../application/use_cases/search-profile.use-case';
import { UpdateProfileAvatarUseCase } from '../../application/use_cases/update-profile-avatar.use-case';
import { CreateProfileCommand } from '../../application/commands/create-profile.command';
import { UpdateProfileCommand } from '../../application/commands/update-profile.command';
import { DeleteProfileCommand } from '../../application/commands/delete-profile.command';
import { UpdateProfileAvatarCommand } from '../../application/commands/update-profile-avatar.command';
import { GetProfileQuery } from '../../application/queries/get-profile.query';
import { ListProfileQuery } from '../../application/queries/list-profile.query';
import { SearchProfileQuery } from '../../application/queries/search-profile.query';
import { ProfileDto } from '../../application/dto/profile.dto';
import { ProfileVisibility } from '../../domain/value-objects/profile-visibility.value-object';
import { ProfileStatus } from '../../domain/value-objects/profile-status.value-object';
import { CreateProfileRequestDto } from '../dto/create-profile.request.dto';
import { UpdateProfileRequestDto } from '../dto/update-profile.request.dto';
import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
import { Role } from '../../../../common/auth/role.enum';
import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { LocalProfileAvatarStorageService } from '../../infrastructure/storage/local-profile-avatar-storage.service';

describe('ProfileController', () => {
  let controller: ProfileController;
  let createUseCase: { execute: jest.Mock };
  let updateUseCase: { execute: jest.Mock };
  let deleteUseCase: { execute: jest.Mock };
  let getUseCase: { execute: jest.Mock };
  let listUseCase: { execute: jest.Mock };
  let searchUseCase: { execute: jest.Mock };
  let updateAvatarUseCase: { execute: jest.Mock };
  let avatarStorage: { save: jest.Mock };

  /** `profileDto.identityId` — the caller owns the Profile under test
   *  in every happy-path case. */
  const caller: AuthenticatedUser = { id: 'identity-1', role: Role.Customer };

  const profileDto: ProfileDto = {
    id: 'id-1',
    identityId: 'identity-1',
    displayName: 'Jane Doe',
    avatarUrl: null,
    bio: null,
    visibility: ProfileVisibility.Public,
    status: ProfileStatus.Active,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  const profileWithAvatarDto: ProfileDto = {
    ...profileDto,
    avatarUrl: 'uploads/profiles/id-1/avatar.png',
  };

  beforeEach(() => {
    createUseCase = { execute: jest.fn().mockResolvedValue(profileDto) };
    updateUseCase = { execute: jest.fn().mockResolvedValue(profileDto) };
    deleteUseCase = { execute: jest.fn().mockResolvedValue(undefined) };
    getUseCase = { execute: jest.fn().mockResolvedValue(profileDto) };
    listUseCase = {
      execute: jest.fn().mockResolvedValue({
        items: [profileDto],
        total: 1,
        page: 1,
        pageSize: 20,
      }),
    };
    searchUseCase = { execute: jest.fn().mockResolvedValue([profileDto]) };
    updateAvatarUseCase = {
      execute: jest.fn().mockResolvedValue(profileWithAvatarDto),
    };
    avatarStorage = {
      save: jest.fn().mockResolvedValue('uploads/profiles/id-1/avatar.png'),
    };

    controller = new ProfileController(
      createUseCase as unknown as CreateProfileUseCase,
      updateUseCase as unknown as UpdateProfileUseCase,
      deleteUseCase as unknown as DeleteProfileUseCase,
      getUseCase as unknown as GetProfileUseCase,
      listUseCase as unknown as ListProfileUseCase,
      searchUseCase as unknown as SearchProfileUseCase,
      updateAvatarUseCase as unknown as UpdateProfileAvatarUseCase,
      avatarStorage as unknown as LocalProfileAvatarStorageService,
    );
  });

  it('create() maps the request DTO to a command and the Application DTO to a response DTO', async () => {
    const dto: CreateProfileRequestDto = {
      identityId: 'identity-1',
      displayName: 'Jane Doe',
      avatarUrl: null,
      bio: null,
      visibility: ProfileVisibility.Public,
    };

    const response = await controller.create(dto, caller);

    expect(createUseCase.execute).toHaveBeenCalledWith(
      new CreateProfileCommand(
        'identity-1',
        'identity-1',
        Role.Customer,
        'Jane Doe',
        null,
        null,
        ProfileVisibility.Public,
      ),
    );
    expect(response.id).toBe('id-1');
    expect(response.createdAt).toBe('2026-01-01T00:00:00.000Z');
  });

  it('update() maps id + request DTO + caller to a command', async () => {
    const dto: UpdateProfileRequestDto = { displayName: 'New Name' };

    const response = await controller.update('id-1', dto, caller);

    expect(updateUseCase.execute).toHaveBeenCalledWith(
      new UpdateProfileCommand(
        'id-1',
        'identity-1',
        Role.Customer,
        'New Name',
        undefined,
        undefined,
      ),
    );
    expect(response.id).toBe('id-1');
  });

  it('remove() delegates to DeleteProfileUseCase with the id and the caller', async () => {
    await controller.remove('id-1', caller);

    expect(deleteUseCase.execute).toHaveBeenCalledWith(
      new DeleteProfileCommand('id-1', 'identity-1', Role.Customer),
    );
  });

  it('list() scopes the query to the caller and maps page/pageSize', async () => {
    const response = await controller.list(caller, '2', '10');

    expect(listUseCase.execute).toHaveBeenCalledWith(
      new ListProfileQuery('identity-1', Role.Customer, 2, 10),
    );
    expect(response.items).toHaveLength(1);
    expect(response.total).toBe(1);
  });

  it('list() defaults page/pageSize when query params are omitted', async () => {
    await controller.list(caller, undefined, undefined);

    expect(listUseCase.execute).toHaveBeenCalledWith(
      new ListProfileQuery('identity-1', Role.Customer),
    );
  });

  it('search() maps the term query param and the Application DTOs to response DTOs', async () => {
    const response = await controller.search('Jane');

    expect(searchUseCase.execute).toHaveBeenCalledWith(
      new SearchProfileQuery('Jane'),
    );
    expect(response).toHaveLength(1);
    expect(response[0].displayName).toBe('Jane Doe');
  });

  it('findOne() passes the caller to GetProfileUseCase and maps its Application DTO', async () => {
    const response = await controller.findOne('id-1', caller);

    expect(getUseCase.execute).toHaveBeenCalledWith(
      new GetProfileQuery('id-1', 'identity-1', Role.Customer),
    );
    expect(response.displayName).toBe('Jane Doe');
  });

  describe('uploadAvatar()', () => {
    const file = {
      originalname: 'avatar.png',
      mimetype: 'image/png',
      buffer: Buffer.from('png-bytes'),
    };

    it('confirms the Profile exists, stores the file, then persists the resulting path', async () => {
      const response = await controller.uploadAvatar('id-1', file, caller);

      expect(getUseCase.execute).toHaveBeenCalledWith(
        new GetProfileQuery('id-1', 'identity-1', Role.Customer),
      );
      expect(avatarStorage.save).toHaveBeenCalledWith('id-1', file);
      expect(updateAvatarUseCase.execute).toHaveBeenCalledWith(
        new UpdateProfileAvatarCommand(
          'id-1',
          'identity-1',
          Role.Customer,
          'uploads/profiles/id-1/avatar.png',
        ),
      );
      expect(response.avatarUrl).toBe('uploads/profiles/id-1/avatar.png');
    });

    it('throws ValidationException when no file is provided', async () => {
      await expect(
        controller.uploadAvatar('id-1', undefined, caller),
      ).rejects.toThrow(ValidationException);
      expect(avatarStorage.save).not.toHaveBeenCalled();
      expect(updateAvatarUseCase.execute).not.toHaveBeenCalled();
    });

    it('propagates NotFoundException from GetProfileUseCase without touching storage', async () => {
      getUseCase.execute.mockRejectedValueOnce(
        new NotFoundException('Profile unknown-id not found'),
      );

      await expect(
        controller.uploadAvatar('unknown-id', file, caller),
      ).rejects.toThrow(NotFoundException);
      expect(avatarStorage.save).not.toHaveBeenCalled();
    });

    it('refuses to store the file when the Profile belongs to another Identity', async () => {
      await expect(
        controller.uploadAvatar('id-1', file, {
          id: 'someone-else',
          role: Role.Customer,
        }),
      ).rejects.toThrow(ForbiddenException);
      expect(avatarStorage.save).not.toHaveBeenCalled();
      expect(updateAvatarUseCase.execute).not.toHaveBeenCalled();
    });
  });
});
