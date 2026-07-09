import { ValueObject } from '../../../core/domain/base/value-object.base';
import { generateId } from '../../../core/domain/utils/id.generator';

interface ProviderIdProps {
  value: string;
}

export class ProviderId extends ValueObject<ProviderIdProps> {
  private constructor(value: string) {
    super({ value });
  }

  public static create(): ProviderId {
    return new ProviderId(generateId());
  }

  public static fromString(value: string): ProviderId {
    return new ProviderId(value);
  }

  public get value(): string {
    return this.props.value;
  }
}
