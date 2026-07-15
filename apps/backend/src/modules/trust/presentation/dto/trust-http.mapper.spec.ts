import { TrustDto } from '../../application/dto/trust.dto';
import { TrustLevel } from '../../domain/value-objects/trust-level.value-object';
import { TrustStatus } from '../../domain/value-objects/trust-status.value-object';
import { CreateTrustProfileRequestDto } from './create-trust-profile.request.dto';
import { UpdateTrustProfileRequestDto } from './update-trust-profile.request.dto';
import { TrustHttpMapper } from './trust-http.mapper';

describe('TrustHttpMapper', () => {
  it('toCreateCommand() carries identityId/score/level through', () => {
    const dto: CreateTrustProfileRequestDto = {
      identityId: 'identity-1',
      score: 60,
      level: TrustLevel.Medium,
    };

    const command = TrustHttpMapper.toCreateCommand(dto);

    expect(command.identityId).toBe('identity-1');
    expect(command.score).toBe(60);
    expect(command.level).toBe(TrustLevel.Medium);
  });

  it('toUpdateCommand() carries the id and optional fields through', () => {
    const dto: UpdateTrustProfileRequestDto = { status: TrustStatus.Suspended };

    const command = TrustHttpMapper.toUpdateCommand('id-1', dto);

    expect(command.id).toBe('id-1');
    expect(command.status).toBe(TrustStatus.Suspended);
  });

  it('toResponse() converts Date fields to ISO strings', () => {
    const dto: TrustDto = {
      id: 'id-1',
      identityId: 'identity-1',
      score: 75,
      level: TrustLevel.High,
      status: TrustStatus.Active,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    };

    const response = TrustHttpMapper.toResponse(dto);

    expect(response.createdAt).toBe('2026-01-01T00:00:00.000Z');
    expect(response.updatedAt).toBe('2026-01-02T00:00:00.000Z');
  });

  it('toListResponse() maps each item and carries pagination metadata through', () => {
    const dto: TrustDto = {
      id: 'id-1',
      identityId: 'identity-1',
      score: 75,
      level: TrustLevel.High,
      status: TrustStatus.Active,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    };

    const response = TrustHttpMapper.toListResponse({
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
