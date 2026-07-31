/**
 * The lifecycle status of a `TrackingSession` — deliberately separate
 * from `OrderStatus`: an Order reaching `OrderStatus.InProgress` is
 * what *allows* a tracking session to start, but the two aren't the
 * same state machine. A provider could lose their live-location
 * connection (dropped socket, backgrounded app) without the
 * underlying Order leaving `InProgress`.
 */
export enum TrackingSessionStatus {
  /** The Order hasn't reached `InProgress` yet, or the provider hasn't
   *  started sharing their location. */
  NotStarted = 'NOT_STARTED',
  /** Actively receiving location updates over the (future) real-time
   *  channel. */
  Active = 'ACTIVE',
  /** A session exists but updates aren't currently flowing (e.g. the
   *  provider's connection dropped) — distinct from `Ended` so callers
   *  can show "reconnecting" rather than "arrived"/"finished". */
  Paused = 'PAUSED',
  /** The provider arrived, or the Order left `InProgress` — the
   *  session is over. */
  Ended = 'ENDED',
}
