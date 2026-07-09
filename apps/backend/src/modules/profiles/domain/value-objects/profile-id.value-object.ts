import { ValueObject } from '../../../core/domain/base/value-object.base';
import { generateId } from '../../../core/domain/utils/id.generator';

interface ProfileIdProps {
  value: string;
}

export class ProfileId extends ValueObject<ProfileIdProps> {
  private constructor(value: string) {
    super({ value });
  }

  public static create(): ProfileId {
    return new ProfileId(generateId());
  }

  public static fromString(value: string): ProfileId {
    return new ProfileId(value);
  }

  public get value(): string {
    return this.props.value;
  }
}
