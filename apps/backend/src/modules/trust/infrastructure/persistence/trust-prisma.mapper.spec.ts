import { TrustModel as PrismaTrust } from '@prisma/client';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Trust } from '../../domain/entities/trust.entity';
import { TrustId } from '../../domain/value-objects/trust-id.value-object';
import { TrustLevel } from '../../domain/value-objects/trust-level.value-object';
import { TrustScore } from '../../domain/value-objects/trust-score.value-object';
import { TrustStatus } from '../../domain/value-objects/trust-status.value-object';
import { TrustPrismaMapper } from './trust-prisma.mapper';

describe('TrustPrismaMapper', () => {
  const row: PrismaTrust = {
    id: 'id-1',
    identityId: 'identity-1',
    score: 75,
    level: 'HIGH',
    status: 'ACTIVE',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
  };

  it('maps a Prisma row to the domain entity', () => {
    const trust = TrustPrismaMapper.toDomain(row);

    expect(trust.id.value).toBe('id-1');
    expect(trust.identityId.value).toBe('identity-1');
    expect(trust.score.value).toBe(75);
    expect(trust.level).toBe(TrustLevel.High);
    expect(trust.status).toBe(TrustStatus.Active);
  });

  it('maps a domain entity back to the Prisma row shape', () => {
    const trust = new Trust(TrustId.fromString('id-1'), {
      identityId: IdentityId.fromString('identity-1'),
      score: TrustScore.of(75),
      level: TrustLevel.High,
      status: TrustStatus.Active,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
    });

    expect(TrustPrismaMapper.toPersistence(trust)).toEqual(row);
  });

  it('round-trips without losing data', () => {
    const trust = TrustPrismaMapper.toDomain(row);
    expect(TrustPrismaMapper.toPersistence(trust)).toEqual(row);
  });
});
