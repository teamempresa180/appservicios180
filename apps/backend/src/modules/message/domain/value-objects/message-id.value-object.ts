import { ValueObject } from '../../../core/domain/base/value-object.base';
import { generateId } from '../../../core/domain/utils/id.generator';

interface MessageIdProps {
  value: string;
}

export class MessageId extends ValueObject<MessageIdProps> {
  private constructor(value: string) {
    super({ value });
  }

  public static create(): MessageId {
    return new MessageId(generateId());
  }

  public static fromString(value: string): MessageId {
    return new MessageId(value);
  }

  public get value(): string {
    return this.props.value;
  }
}
