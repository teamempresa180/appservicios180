import { ValueObject } from '../../../core/domain/base/value-object.base';
import { generateId } from '../../../core/domain/utils/id.generator';

interface RefreshTokenIdProps {
  value: string;
}

export class RefreshTokenId extends ValueObject<RefreshTokenIdProps> {
  private constructor(value: string) {
    super({ value });
  }

  public static create(): RefreshTokenId {
    return new RefreshTokenId(generateId());
  }

  public static fromString(value: string): RefreshTokenId {
    return new RefreshTokenId(value);
  }

  public get value(): string {
    return this.props.value;
  }
}
