import { ValueObject } from '../../../core/domain/base/value-object.base';
import { generateId } from '../../../core/domain/utils/id.generator';

interface AvailabilityIdProps {
  value: string;
}

export class AvailabilityId extends ValueObject<AvailabilityIdProps> {
  private constructor(value: string) {
    super({ value });
  }

  public static create(): AvailabilityId {
    return new AvailabilityId(generateId());
  }

  public static fromString(value: string): AvailabilityId {
    return new AvailabilityId(value);
  }

  public get value(): string {
    return this.props.value;
  }
}
