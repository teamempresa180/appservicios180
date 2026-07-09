import { ValueObject } from '../../../core/domain/base/value-object.base';
import { generateId } from '../../../core/domain/utils/id.generator';

interface AddressIdProps {
  value: string;
}

export class AddressId extends ValueObject<AddressIdProps> {
  private constructor(value: string) {
    super({ value });
  }

  public static create(): AddressId {
    return new AddressId(generateId());
  }

  public static fromString(value: string): AddressId {
    return new AddressId(value);
  }

  public get value(): string {
    return this.props.value;
  }
}
