import { ValueObject } from '../../../core/domain/base/value-object.base';
import { generateId } from '../../../core/domain/utils/id.generator';

interface TrackingSessionIdProps {
  value: string;
}

export class TrackingSessionId extends ValueObject<TrackingSessionIdProps> {
  private constructor(value: string) {
    super({ value });
  }

  public static create(): TrackingSessionId {
    return new TrackingSessionId(generateId());
  }

  public static fromString(value: string): TrackingSessionId {
    return new TrackingSessionId(value);
  }

  public get value(): string {
    return this.props.value;
  }
}
