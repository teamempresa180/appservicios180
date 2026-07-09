import { ValueObject } from '../../../core/domain/base/value-object.base';
import { generateId } from '../../../core/domain/utils/id.generator';

interface ScheduleIdProps {
  value: string;
}

export class ScheduleId extends ValueObject<ScheduleIdProps> {
  private constructor(value: string) {
    super({ value });
  }

  public static create(): ScheduleId {
    return new ScheduleId(generateId());
  }

  public static fromString(value: string): ScheduleId {
    return new ScheduleId(value);
  }

  public get value(): string {
    return this.props.value;
  }
}
