import '../entities/arrival_state.dart';
import '../entities/current_location.dart';
import '../entities/distance_remaining.dart';
import '../entities/eta.dart';
import '../entities/route_point.dart';
import '../entities/tracking_route.dart';
import '../entities/tracking_session.dart';

/// A single snapshot of an Order's live tracking state: the
/// [session] this reading belongs to, where the provider currently is
/// ([providerLocation]), where they're headed ([destination]), the
/// calculated [route] between the two, and the derived [eta]/
/// [distanceRemaining]/[arrivalState]. Emitted repeatedly by
/// `TrackingRepository.watchTracking` as the provider's position
/// updates — see `MockTrackingRepository` for the only implementation
/// that exists today (no live-location backend yet, see that class's
/// doc comment).
///
/// Composed entirely of the pure domain entities in `../entities/` —
/// this class itself carries no Google Maps types, so the
/// presentation layer (`TrackingMap`) is the only place that converts
/// [CurrentLocation]/[RoutePoint] into `LatLng`.
class TrackingUpdate {
  const TrackingUpdate({
    required this.session,
    required this.providerLocation,
    required this.destination,
    required this.route,
    required this.eta,
    required this.distanceRemaining,
    required this.arrivalState,
  });

  final TrackingSession session;
  final CurrentLocation providerLocation;
  final RoutePoint destination;
  final TrackingRoute route;
  final ETA eta;
  final DistanceRemaining distanceRemaining;
  final ArrivalState arrivalState;

  /// Convenience for the presentation layer — equivalent to checking
  /// `arrivalState == ArrivalState.arrived` directly.
  bool get hasArrived => arrivalState == ArrivalState.arrived;
}
