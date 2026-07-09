import { AuthMethodType } from '../../domain/value-objects/auth-method-type.value-object';

/**
 * Input shape for creating an Authentication method. No validation.
 */
export class CreateAuthenticationDto {
  identityId!: string;
  methodType!: AuthMethodType;
}
