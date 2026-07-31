import '../../../order/models/order_id.dart';
import '../entities/tracking_session.dart';
import '../models/tracking_update.dart';

/// Contract for live-tracking an Order's provider en route to the
/// client's destination — the Uber/inDrive-style "sigue tu servicio"
/// screen, for both roles (client watches the provider approach; the
/// provider watches their own route to the client).
///
/// Implemented today only by `MockTrackingRepository` — a real
/// implementation needs two things this backend doesn't have yet: (1)
/// stored coordinates for an Order's destination (`Address` has no
/// lat/lng — see the module README), and (2) a live-location channel
/// (WebSocket) for the provider's device to publish its position and
/// the client's to receive it. Both are Fase 5 backend work, not yet
/// built — see the project's standing roadmap. `HttpTrackingRepository`
/// is intentionally not created until that backend exists, rather than
/// shipping a fake HTTP implementation that can't actually work.
///
/// Two methods, two different jobs, on purpose:
///
/// - [watchTracking] is the live feed the tracking screen subscribes
///   to for its whole lifetime. It stays `Stream`-shaped rather than a
///   plain callback/polling API because a stream is the superset: a
///   future WebSocket-backed implementation emits into it directly as
///   frames arrive, and a polling implementation can just as easily
///   satisfy the same `Stream<TrackingUpdate>` signature internally
///   (e.g. `Stream.periodic` calling a REST endpoint) — callers never
///   need to know which. Neither approach requires changing this
///   interface when the real channel lands.
/// - [getCurrentSession] is a one-shot, polling-friendly lookup for
///   callers that only need to know *whether* a session exists/is
///   active (e.g. deciding whether to show a "Rastrear servicio"
///   button at all) without paying for a live subscription. A real
///   implementation can satisfy it from a plain REST call or from the
///   last value cached off the same socket backing [watchTracking].
abstract class TrackingRepository {
  /// Emits a new [TrackingUpdate] as the provider's position changes,
  /// until the provider arrives (`hasArrived: true`, then the stream
  /// closes) or the caller cancels its subscription.
  Stream<TrackingUpdate> watchTracking(OrderId orderId);

  /// Fetches the current [TrackingSession] for an Order without
  /// opening a live subscription — `status` is
  /// `TrackingSessionStatus.notStarted` (and `startedAt` is `null`) if
  /// the provider hasn't started sharing their location yet.
  Future<TrackingSession> getCurrentSession(OrderId orderId);
}
