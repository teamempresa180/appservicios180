import { ValueObject } from './value-object.base';

interface TestProps {
  value: string;
}

class TestValueObject extends ValueObject<TestProps> {
  constructor(value: string) {
    super({ value });
  }

  get value(): string {
    return this.props.value;
  }
}

describe('ValueObject', () => {
  it('is equal when props are equal', () => {
    const a = new TestValueObject('same');
    const b = new TestValueObject('same');
    expect(a.equals(b)).toBe(true);
  });

  it('is not equal when props differ', () => {
    const a = new TestValueObject('one');
    const b = new TestValueObject('other');
    expect(a.equals(b)).toBe(false);
  });

  it('is not equal to undefined', () => {
    const a = new TestValueObject('one');
    expect(a.equals(undefined)).toBe(false);
  });

  it('is immutable', () => {
    const a = new TestValueObject('one');
    expect(() => {
      (a as unknown as { props: TestProps }).props.value = 'mutated';
    }).toThrow();
  });
});
