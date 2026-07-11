import { IdentityModel as PrismaIdentity } from '@prisma/client';
import { Identity } from '../../domain/entities/identity.entity';
import { DocumentType } from '../../domain/value-objects/document-type.value-object';
import { IdentityId } from '../../domain/value-objects/identity-id.value-object';
import { IdentityStatus } from '../../domain/value-objects/identity-status.value-object';
import { IdentityPrismaMapper } from './identity-prisma.mapper';

describe('IdentityPrismaMapper', () => {
  const row: PrismaIdentity = {
    id: 'id-1',
    fullName: 'Ana',
    documentType: 'NATIONAL_ID',
    documentNumber: '123',
    birthDate: new Date('1990-01-01'),
    status: 'ACTIVE',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
  };

  it('maps a Prisma row to the domain entity', () => {
    const identity = IdentityPrismaMapper.toDomain(row);

    expect(identity.id.value).toBe('id-1');
    expect(identity.fullName).toBe('Ana');
    expect(identity.documentType).toBe(DocumentType.NationalId);
    expect(identity.status).toBe(IdentityStatus.Active);
  });

  it('maps a domain entity back to the Prisma row shape', () => {
    const identity = new Identity(IdentityId.fromString('id-1'), {
      fullName: 'Ana',
      documentType: DocumentType.NationalId,
      documentNumber: '123',
      birthDate: new Date('1990-01-01'),
      status: IdentityStatus.Active,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
    });

    expect(IdentityPrismaMapper.toPersistence(identity)).toEqual(row);
  });

  it('round-trips without losing data', () => {
    const identity = IdentityPrismaMapper.toDomain(row);
    expect(IdentityPrismaMapper.toPersistence(identity)).toEqual(row);
  });
});
