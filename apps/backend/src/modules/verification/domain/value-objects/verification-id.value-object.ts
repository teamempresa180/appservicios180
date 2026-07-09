import { ValueObject } from '../../../core/domain/base/value-object.base';
import { generateId } from '../../../core/domain/utils/id.generator';

interface VerificationIdProps {
  value: string;
}

export class VerificationId extends ValueObject<VerificationIdProps> {
  private constructor(value: string) {
    super({ value });
  }

  public static create(): VerificationId {
    return new VerificationId(generateId());
  }

  public static fromString(value: string): VerificationId {
    return new VerificationId(value);
  }

  public get value(): string {
    return this.props.value;
  }
}
