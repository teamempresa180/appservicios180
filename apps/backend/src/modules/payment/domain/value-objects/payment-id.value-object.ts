import { ValueObject } from '../../../core/domain/base/value-object.base';
import { generateId } from '../../../core/domain/utils/id.generator';

interface PaymentIdProps {
  value: string;
}

export class PaymentId extends ValueObject<PaymentIdProps> {
  private constructor(value: string) {
    super({ value });
  }

  public static create(): PaymentId {
    return new PaymentId(generateId());
  }

  public static fromString(value: string): PaymentId {
    return new PaymentId(value);
  }

  public get value(): string {
    return this.props.value;
  }
}
