/**
 * Base exception for all domain-level errors across every module.
 * Modules should extend this instead of throwing raw errors.
 */
export abstract class DomainException extends Error {
  protected constructor(message: string) {
    super(message);
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
