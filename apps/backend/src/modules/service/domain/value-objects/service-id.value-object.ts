import { ValueObject } from '../../../core/domain/base/value-object.base';
import { generateId } from '../../../core/domain/utils/id.generator';

interface ServiceIdProps {
  value: string;
}

export class ServiceId extends ValueObject<ServiceIdProps> {
  private constructor(value: string) {
    super({ value });
  }

  public static create(): ServiceId {
    return new ServiceId(generateId());
  }

  public static fromString(value: string): ServiceId {
    return new ServiceId(value);
  }

  public get value(): string {
    return this.props.value;
  }
}
