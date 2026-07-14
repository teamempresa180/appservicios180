import { ProfileDto } from '../../application/dto/profile.dto';
import { ProfileVisibility } from '../../domain/value-objects/profile-visibility.value-object';
import { ProfileStatus } from '../../domain/value-objects/profile-status.value-object';
import { CreateProfileRequestDto } from './create-profile.request.dto';
import { UpdateProfileRequestDto } from './update-profile.request.dto';
import { ProfileHttpMapper } from './profile-http.mapper';

describe('ProfileHttpMapper', () => {
  it('toCreateCommand() carries all create fields through, defaulting nullable fields', () => {
    const dto: CreateProfileRequestDto = {
      identityId: 'identity-1',
      displayName: 'Jane Doe',
      visibility: ProfileVisibility.Public,
    };

    const command = ProfileHttpMapper.toCreateCommand(dto);

    expect(command.identityId).toBe('identity-1');
    expect(command.displayName).toBe('Jane Doe');
    expect(command.avatarUrl).toBeNull();
    expect(command.bio).toBeNull();
    expect(command.visibility).toBe(ProfileVisibility.Public);
  });

  it('toUpdateCommand() carries the id and optional fields through', () => {
    const dto: UpdateProfileRequestDto = { status: ProfileStatus.Archived };

    const command = ProfileHttpMapper.toUpdateCommand('id-1', dto);

    expect(command.id).toBe('id-1');
    expect(command.status).toBe(ProfileStatus.Archived);
  });

  it('toResponse() converts Date fields to ISO strings', () => {
    const dto: ProfileDto = {
      id: 'id-1',
      identityId: 'identity-1',
      displayName: 'Jane Doe',
      avatarUrl: null,
      bio: null,
      visibility: ProfileVisibility.Public,
      status: ProfileStatus.Active,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    };

    const response = ProfileHttpMapper.toResponse(dto);

    expect(response.createdAt).toBe('2026-01-01T00:00:00.000Z');
    expect(response.updatedAt).toBe('2026-01-02T00:00:00.000Z');
  });

  it('toListResponse() maps each item and carries pagination metadata through', () => {
    const dto: ProfileDto = {
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

    const response = ProfileHttpMapper.toListResponse({
      items: [dto],
      total: 1,
      page: 1,
      pageSize: 20,
    });

    expect(response.items).toHaveLength(1);
    expect(response.items[0].id).toBe('id-1');
    expect(response.total).toBe(1);
    expect(response.page).toBe(1);
    expect(response.pageSize).toBe(20);
  });
});
