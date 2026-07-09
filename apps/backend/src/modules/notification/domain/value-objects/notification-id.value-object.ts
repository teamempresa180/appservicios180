import { ValueObject } from '../../../core/domain/base/value-object.base';
import { generateId } from '../../../core/domain/utils/id.generator';

interface NotificationIdProps {
  value: string;
}

export class NotificationId extends ValueObject<NotificationIdProps> {
  private constructor(value: string) {
    super({ value });
  }

  public static create(): NotificationId {
    return new NotificationId(generateId());
  }

  public static fromString(value: string): NotificationId {
    return new NotificationId(value);
  }

  public get value(): string {
    return this.props.value;
  }
}
