import { AuthenticationStatus } from '../../domain/value-objects/authentication-status.value-object';

/**
 * Input shape for updating an Authentication method. No validation.
 */
export class UpdateAuthenticationDto {
  status?: AuthenticationStatus;
}
