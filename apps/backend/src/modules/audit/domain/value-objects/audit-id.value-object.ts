import { ValueObject } from '../../../core/domain/base/value-object.base';
import { generateId } from '../../../core/domain/utils/id.generator';

interface AuditIdProps {
  value: string;
}

export class AuditId extends ValueObject<AuditIdProps> {
  private constructor(value: string) {
    super({ value });
  }

  public static create(): AuditId {
    return new AuditId(generateId());
  }

  public static fromString(value: string): AuditId {
    return new AuditId(value);
  }

  public get value(): string {
    return this.props.value;
  }
}
