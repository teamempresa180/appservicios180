import { Authentication } from './authentication.entity';
import { AuthenticationId } from '../value-objects/authentication-id.value-object';
import { AuthMethodType } from '../value-objects/auth-method-type.value-object';
import { AuthenticationStatus } from '../value-objects/authentication-status.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';

describe('Authentication', () => {
  it('holds all the assigned properties', () => {
    const id = AuthenticationId.create();
    const identityId = IdentityId.create();
    const now = new Date();
    const authentication = new Authentication(id, {
      identityId,
      methodType: AuthMethodType.Password,
      status: AuthenticationStatus.Active,
      createdAt: now,
      updatedAt: now,
    });

    expect(authentication.id).toBe(id);
    expect(authentication.identityId).toBe(identityId);
    expect(authentication.methodType).toBe(AuthMethodType.Password);
    expect(authentication.status).toBe(AuthenticationStatus.Active);
  });
});
