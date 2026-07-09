/**
 * Base class for domain Entities.
 * Two entities are equal when they are of the same runtime type and share the same identity.
 */
export abstract class Entity<TId> {
  protected readonly _id: TId;

  protected constructor(id: TId) {
    this._id = id;
  }

  public get id(): TId {
    return this._id;
  }

  public equals(other?: Entity<TId>): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (this === other) {
      return true;
    }
    if (this.constructor !== other.constructor) {
      return false;
    }
    return JSON.stringify(this._id) === JSON.stringify(other._id);
  }
}
