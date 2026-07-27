import 'package:google_maps_flutter/google_maps_flutter.dart';

/// A single snapshot of an Order's live tracking state: where the
/// provider currently is, where they're headed (the client's
/// destination), and a derived ETA/distance. Emitted repeatedly by
/// `TrackingRepository.watchTracking` as the provider's position
/// updates — see `MockTrackingRepository` for the only implementation
/// that exists today (no live-location backend yet, see that class's
/// doc comment).
class TrackingUpdate {
  const TrackingUpdate({
    required this.providerPosition,
    required this.destination,
    required this.etaMinutes,
    required this.distanceMeters,
    required this.hasArrived,
  });

  final LatLng providerPosition;
  final LatLng destination;
  final int etaMinutes;
  final double distanceMeters;
  final bool hasArrived;
}
