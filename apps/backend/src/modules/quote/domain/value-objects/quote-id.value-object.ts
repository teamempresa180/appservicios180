import { ValueObject } from '../../../core/domain/base/value-object.base';
import { generateId } from '../../../core/domain/utils/id.generator';

interface QuoteIdProps {
  value: string;
}

export class QuoteId extends ValueObject<QuoteIdProps> {
  private constructor(value: string) {
    super({ value });
  }

  public static create(): QuoteId {
    return new QuoteId(generateId());
  }

  public static fromString(value: string): QuoteId {
    return new QuoteId(value);
  }

  public get value(): string {
    return this.props.value;
  }
}
