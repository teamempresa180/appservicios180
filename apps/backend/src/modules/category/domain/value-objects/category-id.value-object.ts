import { ValueObject } from '../../../core/domain/base/value-object.base';
import { generateId } from '../../../core/domain/utils/id.generator';

interface CategoryIdProps {
  value: string;
}

export class CategoryId extends ValueObject<CategoryIdProps> {
  private constructor(value: string) {
    super({ value });
  }

  public static create(): CategoryId {
    return new CategoryId(generateId());
  }

  public static fromString(value: string): CategoryId {
    return new CategoryId(value);
  }

  public get value(): string {
    return this.props.value;
  }
}
