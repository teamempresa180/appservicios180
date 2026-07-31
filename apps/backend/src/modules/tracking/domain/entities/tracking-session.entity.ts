/**
 * `tracking` module — domain layer only, deliberately.
 *
 * This module models the shape of a future real-time
 * provider-location-tracking feature (Prompt 14 / roadmap Fase 5)
 * *before* the real-time channel it depends on exists. It exists so
 * the next stage — wiring an actual live-location transport (a
 * WebSocket gateway, most likely) — has a domain contract to "plug
 * into" instead of designing entities and business rules under
 * deadline pressure once the transport work starts.
 *
 * What's intentionally **not** here yet, and why:
 * - **No Prisma model / migration.** There is no real-time data source
 *   to persist yet — a `TrackingSession` row would have no writer.
 *   Persisting it now would mean guessing at a schema before the
 *   transport that produces the data is chosen.
 * - **No application layer** (use cases, commands, queries). Every
 *   realistic use case here ("start a session", "record a location
 *   update", "get the current session") needs the real-time channel
 *   or a repository implementation to do anything meaningful; without
 *   either, a use case would just be a pass-through wrapper with
 *   nothing to orchestrate.
 * - **No controller / route / module wiring into `app.module.ts`.**
 *   There is nothing to expose over HTTP yet — no persistence, no use
 *   cases, no way to fulfil a request.
 *
 * What *is* here: the `TrackingSession` entity and
 * `TrackingRepository` contract — the vocabulary a real
 * implementation (built once the transport exists) must satisfy,
 * matching the equivalent domain modeling already done on the mobile
 * side (`apps/mobile/lib/features/tracking/entities/`).
 */
import { Entity } from '../../../core/domain/base/entity.base';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { TrackingSessionId } from '../value-objects/tracking-session-id.value-object';
import { TrackingSessionStatus } from '../value-objects/tracking-session-status.value-object';

export interface TrackingSessionProps {
  orderId: OrderId;
  providerId: ProviderId;
  status: TrackingSessionStatus;
  startedAt: Date | null;
}

/**
 * One active-or-past tracking session for an `Order` — created the
 * moment a provider starts a service (`OrderStatus.InProgress`) and
 * updated as location events arrive over the future real-time
 * channel. Pure data holder — no socket, no timers, no persistence.
 *
 * `orderId` ties this session back to the `Order` being tracked (the
 * Order itself remains the source of truth for the service's
 * lifecycle — this entity never duplicates it). `providerId` is
 * carried directly rather than looked up through `orderId` because a
 * real implementation authorizes/streams per-provider and needs it up
 * front, mirroring how `Order.providerId` already works.
 */
export class TrackingSession extends Entity<TrackingSessionId> {
  public readonly orderId: OrderId;
  public readonly providerId: ProviderId;
  public readonly status: TrackingSessionStatus;
  /** When the provider started sharing their location. `null` while
   *  `status` is `TrackingSessionStatus.NotStarted`. */
  public readonly startedAt: Date | null;

  constructor(id: TrackingSessionId, props: TrackingSessionProps) {
    super(id);
    this.orderId = props.orderId;
    this.providerId = props.providerId;
    this.status = props.status;
    this.startedAt = props.startedAt;
  }
}
