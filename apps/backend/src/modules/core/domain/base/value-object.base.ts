/**
 * Base class for domain Value Objects.
 * Two value objects are equal when all of their declared properties are equal.
 * Value objects are immutable — properties are frozen on construction.
 */
export abstract class ValueObject<TProps extends object> {
  protected readonly props: TProps;

  protected constructor(props: TProps) {
    this.props = Object.freeze({ ...props });
  }

  public equals(other?: ValueObject<TProps>): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (!(other instanceof ValueObject)) {
      return false;
    }
    return JSON.stringify(this.props) === JSON.stringify(other.props);
  }
}
