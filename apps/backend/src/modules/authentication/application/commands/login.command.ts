/**
 * Intent to log in with a documentNumber/password pair. Plain data —
 * no behavior. `password` is the plaintext password, never persisted
 * or logged — see `LoginUseCase`.
 */
export class LoginCommand {
  constructor(
    public readonly documentNumber: string,
    public readonly password: string,
  ) {}
}
