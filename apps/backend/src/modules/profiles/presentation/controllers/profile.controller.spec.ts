import { ProfileController } from './profile.controller';
import { CreateProfileUseCase } from '../../application/use_cases/create-profile.use-case';
import { UpdateProfileUseCase } from '../../application/use_cases/update-profile.use-case';
import { DeleteProfileUseCase } from '../../application/use_cases/delete-profile.use-case';
import { GetProfileUseCase } from '../../application/use_cases/get-profile.use-case';
import { ListProfileUseCase } from '../../application/use_cases/list-profile.use-case';
import { SearchProfileUseCase } from '../../application/use_cases/search-profile.use-case';
import { CreateProfileCommand } from '../../application/commands/create-profile.command';
import { UpdateProfileCommand } from '../../application/commands/update-profile.command';
import { DeleteProfileCommand } from '../../application/commands/delete-profile.command';
import { GetProfileQuery } from '../../application/queries/get-profile.query';
import { ListProfileQuery } from '../../application/queries/list-profile.query';
import { SearchProfileQuery } from '../../application/queries/search-profile.query';
import { ProfileDto } from '../../application/dto/profile.dto';
import { ProfileVisibility } from '../../domain/value-objects/profile-visibility.value-object';
import { ProfileStatus } from '../../domain/value-objects/profile-status.value-object';
import { CreateProfileRequestDto } from '../dto/create-profile.request.dto';
import { UpdateProfileRequestDto } from '../dto/update-profile.request.dto';

describe('ProfileController', () => {
  let controller: ProfileController;
  let createUseCase: { execute: jest.Mock };
  let updateUseCase: { execute: jest.Mock };
  let deleteUseCase: { execute: jest.Mock };
  let getUseCase: { execute: jest.Mock };
  let listUseCase: { execute: jest.Mock };
  let searchUseCase: { execute: jest.Mock };

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

    controller = new ProfileController(
      createUseCase as unknown as CreateProfileUseCase,
      updateUseCase as unknown as UpdateProfileUseCase,
      deleteUseCase as unknown as DeleteProfileUseCase,
      getUseCase as unknown as GetProfileUseCase,
      listUseCase as unknown as ListProfileUseCase,
      searchUseCase as unknown as SearchProfileUseCase,
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

    const response = await controller.create(dto);

    expect(createUseCase.execute).toHaveBeenCalledWith(
      new CreateProfileCommand(
        'identity-1',
        'Jane Doe',
        null,
        null,
        ProfileVisibility.Public,
      ),
    );
    expect(response.id).toBe('id-1');
    expect(response.createdAt).toBe('2026-01-01T00:00:00.000Z');
  });

  it('update() maps id + request DTO to a command', async () => {
    const dto: UpdateProfileRequestDto = { displayName: 'New Name' };

    const response = await controller.update('id-1', dto);

    expect(updateUseCase.execute).toHaveBeenCalledWith(
      new UpdateProfileCommand('id-1', 'New Name', undefined, undefined),
    );
    expect(response.id).toBe('id-1');
  });

  it('remove() delegates to DeleteProfileUseCase with the id', async () => {
    await controller.remove('id-1');

    expect(deleteUseCase.execute).toHaveBeenCalledWith(
      new DeleteProfileCommand('id-1'),
    );
  });

  it('list() maps page/pageSize query params to a query and wraps the paginated result', async () => {
    const response = await controller.list('2', '10');

    expect(listUseCase.execute).toHaveBeenCalledWith(
      new ListProfileQuery(2, 10),
    );
    expect(response.items).toHaveLength(1);
    expect(response.total).toBe(1);
  });

  it('list() defaults page/pageSize when query params are omitted', async () => {
    await controller.list(undefined, undefined);

    expect(listUseCase.execute).toHaveBeenCalledWith(new ListProfileQuery());
  });

  it('search() maps the term query param and the Application DTOs to response DTOs', async () => {
    const response = await controller.search('Jane');

    expect(searchUseCase.execute).toHaveBeenCalledWith(
      new SearchProfileQuery('Jane'),
    );
    expect(response).toHaveLength(1);
    expect(response[0].displayName).toBe('Jane Doe');
  });

  it('findOne() maps the Application DTO returned by GetProfileUseCase', async () => {
    const response = await controller.findOne('id-1');

    expect(getUseCase.execute).toHaveBeenCalledWith(
      new GetProfileQuery('id-1'),
    );
    expect(response.displayName).toBe('Jane Doe');
  });
});
