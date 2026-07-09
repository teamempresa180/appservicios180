import { ValueObject } from '../../../core/domain/base/value-object.base';

interface TrustScoreProps {
  value: number;
}

/**
 * Represents a trust/reputation score. Pure data wrapper — no scoring rules,
 * no range validation, no calculation logic.
 */
export class TrustScore extends ValueObject<TrustScoreProps> {
  private constructor(value: number) {
    super({ value });
  }

  public static of(value: number): TrustScore {
    return new TrustScore(value);
  }

  public get value(): number {
    return this.props.value;
  }
}
