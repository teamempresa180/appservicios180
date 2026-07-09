import { TrustScore } from './trust-score.value-object';

describe('TrustScore', () => {
  it('wraps a numeric value', () => {
    const score = TrustScore.of(87);
    expect(score.value).toBe(87);
  });

  it('is equal by value', () => {
    expect(TrustScore.of(50).equals(TrustScore.of(50))).toBe(true);
    expect(TrustScore.of(50).equals(TrustScore.of(60))).toBe(false);
  });
});
