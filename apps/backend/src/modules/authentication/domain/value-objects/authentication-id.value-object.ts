import { ValueObject } from '../../../core/domain/base/value-object.base';
import { generateId } from '../../../core/domain/utils/id.generator';

interface AuthenticationIdProps {
  value: string;
}

export class AuthenticationId extends ValueObject<AuthenticationIdProps> {
  private constructor(value: string) {
    super({ value });
  }

  public static create(): AuthenticationId {
    return new AuthenticationId(generateId());
  }

  public static fromString(value: string): AuthenticationId {
    return new AuthenticationId(value);
  }

  public get value(): string {
    return this.props.value;
  }
}
