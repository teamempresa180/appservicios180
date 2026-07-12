import { VerificationModel as PrismaVerification } from '@prisma/client';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Verification } from '../../domain/entities/verification.entity';
import { VerificationId } from '../../domain/value-objects/verification-id.value-object';
import { VerificationStatus } from '../../domain/value-objects/verification-status.value-object';
import { VerificationType } from '../../domain/value-objects/verification-type.value-object';
import { VerificationPrismaMapper } from './verification-prisma.mapper';

describe('VerificationPrismaMapper', () => {
  const row: PrismaVerification = {
    id: 'id-1',
    identityId: 'identity-1',
    type: 'DOCUMENT',
    status: 'PENDING',
    verifiedAt: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
  };

  it('maps a Prisma row to the domain entity', () => {
    const verification = VerificationPrismaMapper.toDomain(row);

    expect(verification.id.value).toBe('id-1');
    expect(verification.identityId.value).toBe('identity-1');
    expect(verification.type).toBe(VerificationType.Document);
    expect(verification.status).toBe(VerificationStatus.Pending);
    expect(verification.verifiedAt).toBeNull();
  });

  it('maps a domain entity back to the Prisma row shape', () => {
    const verification = new Verification(VerificationId.fromString('id-1'), {
      identityId: IdentityId.fromString('identity-1'),
      type: VerificationType.Document,
      status: VerificationStatus.Pending,
      verifiedAt: null,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
    });

    expect(VerificationPrismaMapper.toPersistence(verification)).toEqual(row);
  });

  it('round-trips without losing data', () => {
    const verification = VerificationPrismaMapper.toDomain(row);
    expect(VerificationPrismaMapper.toPersistence(verification)).toEqual(row);
  });
});
