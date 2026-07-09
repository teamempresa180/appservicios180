import { AuthMethodType } from '../../domain/value-objects/auth-method-type.value-object';
import { AuthenticationStatus } from '../../domain/value-objects/authentication-status.value-object';

/**
 * Output shape returned by queries and use cases.
 */
export class AuthenticationDto {
  id!: string;
  identityId!: string;
  methodType!: AuthMethodType;
  status!: AuthenticationStatus;
  createdAt!: Date;
  updatedAt!: Date;
}
