import { ValueObject } from '../../../core/domain/base/value-object.base';
import { generateId } from '../../../core/domain/utils/id.generator';

interface OrderIdProps {
  value: string;
}

export class OrderId extends ValueObject<OrderIdProps> {
  private constructor(value: string) {
    super({ value });
  }

  public static create(): OrderId {
    return new OrderId(generateId());
  }

  public static fromString(value: string): OrderId {
    return new OrderId(value);
  }

  public get value(): string {
    return this.props.value;
  }
}
