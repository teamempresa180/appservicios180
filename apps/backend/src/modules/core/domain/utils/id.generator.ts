import { randomUUID } from 'node:crypto';

/**
 * Generates a cryptographically strong RFC-4122 v4 UUID. Every
 * entity id in the system is generated here — `crypto.randomUUID()`
 * (Node's CSPRNG-backed implementation, stable since Node 14.17) is
 * used instead of a `Math.random()`-based generator, since the latter
 * is not cryptographically secure and several parts of the system
 * (e.g. `/uploads` file paths) rely on ids being unguessable.
 */
export function generateId(): string {
  return randomUUID();
}
