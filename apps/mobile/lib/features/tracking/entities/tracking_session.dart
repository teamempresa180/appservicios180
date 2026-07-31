import '../../../core/base/entity.dart';
import '../../../order/models/order_id.dart';
import '../../../provider/models/provider_id.dart';
import '../models/tracking_session_id.dart';
import '../models/tracking_session_status.dart';

/// One active-or-past tracking session for an Order — the domain
/// object a future real-time backend creates the moment a provider
/// starts a service (`OrderStatus.inProgress`, see
/// `ProviderOrderJourney`'s `startService` action) and updates as
/// location events arrive. Pure data holder — no socket, no timers, no
/// persistence — same convention as `Order` in `order/entities/order.dart`.
///
/// [orderId] ties this session back to the `Order` being tracked
/// (never duplicated — the Order itself remains the source of truth
/// for the service's lifecycle). [providerId] is carried directly
/// rather than looked up through `orderId` because a real
/// implementation authorizes/streams per-provider and needs it
/// up front, mirroring how `Order.providerId` already works.
class TrackingSession extends Entity<TrackingSessionId> {
  const TrackingSession({
    required TrackingSessionId id,
    required this.orderId,
    required this.providerId,
    required this.status,
    required this.startedAt,
  }) : super(id);

  final OrderId orderId;
  final ProviderId providerId;
  final TrackingSessionStatus status;

  /// When the provider started sharing their location. `null` while
  /// [status] is `TrackingSessionStatus.notStarted`.
  final DateTime? startedAt;

  TrackingSession copyWith({
    TrackingSessionStatus? status,
    DateTime? startedAt,
  }) {
    return TrackingSession(
      id: id,
      orderId: orderId,
      providerId: providerId,
      status: status ?? this.status,
      startedAt: startedAt ?? this.startedAt,
    );
  }
}
