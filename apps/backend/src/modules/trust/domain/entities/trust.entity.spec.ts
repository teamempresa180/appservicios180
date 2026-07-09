import { Trust } from './trust.entity';
import { TrustId } from '../value-objects/trust-id.value-object';
import { TrustScore } from '../value-objects/trust-score.value-object';
import { TrustLevel } from '../value-objects/trust-level.value-object';
import { TrustStatus } from '../value-objects/trust-status.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';

describe('Trust', () => {
  it('holds all the assigned properties', () => {
    const id = TrustId.create();
    const identityId = IdentityId.create();
    const now = new Date();
    const trust = new Trust(id, {
      identityId,
      score: TrustScore.of(92),
      level: TrustLevel.VeryHigh,
      status: TrustStatus.Active,
      createdAt: now,
      updatedAt: now,
    });

    expect(trust.id).toBe(id);
    expect(trust.identityId).toBe(identityId);
    expect(trust.score.value).toBe(92);
    expect(trust.level).toBe(TrustLevel.VeryHigh);
  });
});
