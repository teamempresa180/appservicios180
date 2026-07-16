/**
 * Contract for hashing/verifying passwords. No implementation lives
 * in this module — concrete implementations belong to the
 * infrastructure layer (`BcryptPasswordHasher`), same pattern as
 * every repository interface in this codebase.
 */
export const PASSWORD_HASHER = Symbol('PasswordHasher');

export interface PasswordHasher {
  hash(plainPassword: string): Promise<string>;
  verify(plainPassword: string, passwordHash: string): Promise<boolean>;
}
