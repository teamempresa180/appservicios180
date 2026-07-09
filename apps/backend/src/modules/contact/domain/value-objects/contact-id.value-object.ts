import { ValueObject } from '../../../core/domain/base/value-object.base';
import { generateId } from '../../../core/domain/utils/id.generator';

interface ContactIdProps {
  value: string;
}

export class ContactId extends ValueObject<ContactIdProps> {
  private constructor(value: string) {
    super({ value });
  }

  public static create(): ContactId {
    return new ContactId(generateId());
  }

  public static fromString(value: string): ContactId {
    return new ContactId(value);
  }

  public get value(): string {
    return this.props.value;
  }
}
