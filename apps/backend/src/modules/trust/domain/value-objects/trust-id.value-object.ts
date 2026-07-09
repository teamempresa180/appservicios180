import { ValueObject } from '../../../core/domain/base/value-object.base';
import { generateId } from '../../../core/domain/utils/id.generator';

interface TrustIdProps {
  value: string;
}

export class TrustId extends ValueObject<TrustIdProps> {
  private constructor(value: string) {
    super({ value });
  }

  public static create(): TrustId {
    return new TrustId(generateId());
  }

  public static fromString(value: string): TrustId {
    return new TrustId(value);
  }

  public get value(): string {
    return this.props.value;
  }
}
