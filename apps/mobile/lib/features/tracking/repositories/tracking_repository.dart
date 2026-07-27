import '../../../order/models/order_id.dart';
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
abstract class TrackingRepository {
  /// Emits a new [TrackingUpdate] as the provider's position changes,
  /// until the provider arrives (`hasArrived: true`, then the stream
  /// closes) or the caller cancels its subscription.
  Stream<TrackingUpdate> watchTracking(OrderId orderId);
}
