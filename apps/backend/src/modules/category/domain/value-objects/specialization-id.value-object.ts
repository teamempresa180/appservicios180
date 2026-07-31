import { ValueObject } from '../../../core/domain/base/value-object.base';
import { generateId } from '../../../core/domain/utils/id.generator';

interface SpecializationIdProps {
  value: string;
}

export class SpecializationId extends ValueObject<SpecializationIdProps> {
  private constructor(value: string) {
    super({ value });
  }

  public static create(): SpecializationId {
    return new SpecializationId(generateId());
  }

  public static fromString(value: string): SpecializationId {
    return new SpecializationId(value);
  }

  public get value(): string {
    return this.props.value;
  }
}
