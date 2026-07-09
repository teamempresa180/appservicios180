import { ValueObject } from '../../../core/domain/base/value-object.base';
import { generateId } from '../../../core/domain/utils/id.generator';

interface ChatIdProps {
  value: string;
}

export class ChatId extends ValueObject<ChatIdProps> {
  private constructor(value: string) {
    super({ value });
  }

  public static create(): ChatId {
    return new ChatId(generateId());
  }

  public static fromString(value: string): ChatId {
    return new ChatId(value);
  }

  public get value(): string {
    return this.props.value;
  }
}
