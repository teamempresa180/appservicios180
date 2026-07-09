import { ValueObject } from '../../../core/domain/base/value-object.base';
import { generateId } from '../../../core/domain/utils/id.generator';

interface AttachmentIdProps {
  value: string;
}

export class AttachmentId extends ValueObject<AttachmentIdProps> {
  private constructor(value: string) {
    super({ value });
  }

  public static create(): AttachmentId {
    return new AttachmentId(generateId());
  }

  public static fromString(value: string): AttachmentId {
    return new AttachmentId(value);
  }

  public get value(): string {
    return this.props.value;
  }
}
