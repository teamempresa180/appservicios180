import { TrackingSession } from '../entities/tracking-session.entity';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';

/**
 * Contract for `TrackingSession` persistence/lookup. No implementation
 * lives in this module — see `tracking-session.entity.ts`'s doc
 * comment for why (no real-time data source to back it yet).
 *
 * `getActiveSession` returns `TrackingSession | null` rather than
 * throwing: "no active session for this order" is an expected,
 * ordinary outcome (the provider hasn't started the service, or the
 * session already ended), not an error condition.
 */
/** DI token — interfaces have no runtime value in TS, so NestJS needs
 *  this to inject a `TrackingRepository` implementation by contract
 *  instead of by concrete class. Unused until a concrete
 *  implementation and module wiring exist (see this module's scoping
 *  note), but declared now so that future wiring is a drop-in. */
export const TRACKING_REPOSITORY = Symbol('TrackingRepository');

export interface TrackingRepository {
  /** The current (or most recent) session tracking `orderId`, or
   *  `null` if tracking has never started for that order. */
  getActiveSession(orderId: OrderId): Promise<TrackingSession | null>;

  /** Persists a new or updated session — e.g. on session start, pause,
   *  resume, or end. */
  save(session: TrackingSession): Promise<void>;
}
