import { BcryptPasswordHasher } from './bcrypt-password-hasher';

describe('BcryptPasswordHasher', () => {
  const hasher = new BcryptPasswordHasher();

  it('hashes a password to a value distinct from the plaintext', async () => {
    const hash = await hasher.hash('Str0ngPassw0rd!');
    expect(hash).not.toBe('Str0ngPassw0rd!');
    expect(hash.length).toBeGreaterThan(0);
  });

  it('produces a different hash each time (random salt)', async () => {
    const first = await hasher.hash('Str0ngPassw0rd!');
    const second = await hasher.hash('Str0ngPassw0rd!');
    expect(first).not.toBe(second);
  });

  it('verify() returns true for the correct password', async () => {
    const hash = await hasher.hash('Str0ngPassw0rd!');
    await expect(hasher.verify('Str0ngPassw0rd!', hash)).resolves.toBe(true);
  });

  it('verify() returns false for an incorrect password', async () => {
    const hash = await hasher.hash('Str0ngPassw0rd!');
    await expect(hasher.verify('wrong-password', hash)).resolves.toBe(false);
  });
});
