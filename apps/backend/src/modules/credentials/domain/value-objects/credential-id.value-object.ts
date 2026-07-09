import { ValueObject } from '../../../core/domain/base/value-object.base';
import { generateId } from '../../../core/domain/utils/id.generator';

interface CredentialIdProps {
  value: string;
}

export class CredentialId extends ValueObject<CredentialIdProps> {
  private constructor(value: string) {
    super({ value });
  }

  public static create(): CredentialId {
    return new CredentialId(generateId());
  }

  public static fromString(value: string): CredentialId {
    return new CredentialId(value);
  }

  public get value(): string {
    return this.props.value;
  }
}
