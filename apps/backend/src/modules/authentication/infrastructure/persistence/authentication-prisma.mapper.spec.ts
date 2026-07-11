import { AuthenticationModel as PrismaAuthentication } from '@prisma/client';
import { Authentication } from '../../domain/entities/authentication.entity';
import { AuthMethodType } from '../../domain/value-objects/auth-method-type.value-object';
import { AuthenticationId } from '../../domain/value-objects/authentication-id.value-object';
import { AuthenticationStatus } from '../../domain/value-objects/authentication-status.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { AuthenticationPrismaMapper } from './authentication-prisma.mapper';

describe('AuthenticationPrismaMapper', () => {
  const row: PrismaAuthentication = {
    id: 'auth-1',
    identityId: 'identity-1',
    methodType: 'PASSWORD',
    status: 'ACTIVE',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
  };

  it('maps a Prisma row to the domain entity', () => {
    const authentication = AuthenticationPrismaMapper.toDomain(row);

    expect(authentication.id.value).toBe('auth-1');
    expect(authentication.identityId.value).toBe('identity-1');
    expect(authentication.methodType).toBe(AuthMethodType.Password);
    expect(authentication.status).toBe(AuthenticationStatus.Active);
  });

  it('maps a domain entity back to the Prisma row shape', () => {
    const authentication = new Authentication(
      AuthenticationId.fromString('auth-1'),
      {
        identityId: IdentityId.fromString('identity-1'),
        methodType: AuthMethodType.Password,
        status: AuthenticationStatus.Active,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      },
    );

    expect(AuthenticationPrismaMapper.toPersistence(authentication)).toEqual(
      row,
    );
  });
});
