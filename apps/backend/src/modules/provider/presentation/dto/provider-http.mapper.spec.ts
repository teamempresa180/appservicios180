import { ProviderDto } from '../../application/dto/provider.dto';
import { ProviderType } from '../../domain/value-objects/provider-type.value-object';
import { ProviderStatus } from '../../domain/value-objects/provider-status.value-object';
import { ProviderExperience } from '../../domain/value-objects/provider-experience.value-object';
import { CreateProviderRequestDto } from './create-provider.request.dto';
import { UpdateProviderRequestDto } from './update-provider.request.dto';
import { ProviderHttpMapper } from './provider-http.mapper';

describe('ProviderHttpMapper', () => {
  it('toCreateCommand() carries all create fields through', () => {
    const dto: CreateProviderRequestDto = {
      identityId: 'identity-1',
      providerProfileId: 'profile-1',
      type: ProviderType.Freelancer,
      experience: ProviderExperience.Expert,
      biography: 'Expert electrician.',
      yearsOfExperience: 20,
    };

    const command = ProviderHttpMapper.toCreateCommand(dto);

    expect(command.identityId).toBe('identity-1');
    expect(command.providerProfileId).toBe('profile-1');
    expect(command.type).toBe(ProviderType.Freelancer);
    expect(command.experience).toBe(ProviderExperience.Expert);
    expect(command.yearsOfExperience).toBe(20);
  });

  it('toUpdateCommand() carries the id and optional fields through', () => {
    const dto: UpdateProviderRequestDto = { status: ProviderStatus.Suspended };

    const command = ProviderHttpMapper.toUpdateCommand('id-1', dto);

    expect(command.id).toBe('id-1');
    expect(command.status).toBe(ProviderStatus.Suspended);
  });

  it('toResponse() converts Date fields to ISO strings', () => {
    const dto: ProviderDto = {
      id: 'id-1',
      identityId: 'identity-1',
      providerProfileId: 'profile-1',
      categoryId: null,
      specialization: null,
      status: ProviderStatus.Active,
      type: ProviderType.Independent,
      experience: ProviderExperience.Intermediate,
      biography: 'Plumber with 10 years of experience.',
      yearsOfExperience: 10,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    };

    const response = ProviderHttpMapper.toResponse(dto);

    expect(response.createdAt).toBe('2026-01-01T00:00:00.000Z');
    expect(response.updatedAt).toBe('2026-01-02T00:00:00.000Z');
  });

  it('toListResponse() maps each item and carries pagination metadata through', () => {
    const dto: ProviderDto = {
      id: 'id-1',
      identityId: 'identity-1',
      providerProfileId: 'profile-1',
      categoryId: null,
      specialization: null,
      status: ProviderStatus.Active,
      type: ProviderType.Independent,
      experience: ProviderExperience.Intermediate,
      biography: 'Plumber with 10 years of experience.',
      yearsOfExperience: 10,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    };

    const response = ProviderHttpMapper.toListResponse({
      items: [dto],
      total: 1,
      page: 1,
      pageSize: 20,
    });

    expect(response.items).toHaveLength(1);
    expect(response.items[0].id).toBe('id-1');
    expect(response.total).toBe(1);
  });
});
