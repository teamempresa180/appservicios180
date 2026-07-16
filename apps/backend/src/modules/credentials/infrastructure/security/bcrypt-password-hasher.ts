import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PasswordHasher } from '../../application/ports/password-hasher.port';

const SALT_ROUNDS = 12;

/**
 * `PasswordHasher` implementation backed by `bcryptjs` — a pure-JS
 * bcrypt implementation (no native compilation step, so it installs
 * identically on every platform/CI runner). The only place in this
 * module that imports `bcryptjs`.
 */
@Injectable()
export class BcryptPasswordHasher implements PasswordHasher {
  async hash(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, SALT_ROUNDS);
  }

  async verify(plainPassword: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, passwordHash);
  }
}
