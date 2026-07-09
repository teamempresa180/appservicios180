import { ValueObject } from '../../../core/domain/base/value-object.base';
import { generateId } from '../../../core/domain/utils/id.generator';

interface ReviewIdProps {
  value: string;
}

export class ReviewId extends ValueObject<ReviewIdProps> {
  private constructor(value: string) {
    super({ value });
  }

  public static create(): ReviewId {
    return new ReviewId(generateId());
  }

  public static fromString(value: string): ReviewId {
    return new ReviewId(value);
  }

  public get value(): string {
    return this.props.value;
  }
}
