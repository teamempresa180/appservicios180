import { Entity } from './entity.base';

class TestEntity extends Entity<string> {
  constructor(id: string) {
    super(id);
  }
}

class OtherEntity extends Entity<string> {
  constructor(id: string) {
    super(id);
  }
}

describe('Entity', () => {
  it('exposes its id', () => {
    const entity = new TestEntity('id-1');
    expect(entity.id).toBe('id-1');
  });

  it('is equal to another entity of the same type with the same id', () => {
    const a = new TestEntity('id-1');
    const b = new TestEntity('id-1');
    expect(a.equals(b)).toBe(true);
  });

  it('is not equal when ids differ', () => {
    const a = new TestEntity('id-1');
    const b = new TestEntity('id-2');
    expect(a.equals(b)).toBe(false);
  });

  it('is not equal to an entity of a different type sharing the same id', () => {
    const a = new TestEntity('id-1');
    const b = new OtherEntity('id-1');
    expect(a.equals(b)).toBe(false);
  });

  it('is not equal to undefined', () => {
    const a = new TestEntity('id-1');
    expect(a.equals(undefined)).toBe(false);
  });
});
