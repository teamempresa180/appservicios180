import { ValueObject } from '../../../core/domain/base/value-object.base';
import { generateId } from '../../../core/domain/utils/id.generator';

interface IdentityIdProps {
  value: string;
}

export class IdentityId extends ValueObject<IdentityIdProps> {
  private constructor(value: string) {
    super({ value });
  }

  public static create(): IdentityId {
    return new IdentityId(generateId());
  }

  public static fromString(value: string): IdentityId {
    return new IdentityId(value);
  }

  public get value(): string {
    return this.props.value;
  }
}
