import '../../../core/base/value_object.dart';

/// A single reading of where the provider's device was at a point in
/// time — deliberately a pure lat/lng/timestamp value object with no
/// dependency on `google_maps_flutter`'s `LatLng`: this is the domain
/// shape a future WebSocket payload would deserialize into, and the
/// presentation layer (`TrackingMap`) is the only place that should
/// know Google Maps types exist. [headingDegrees] (0-360, clockwise
/// from north) lets the map rotate the provider's marker to match
/// their direction of travel instead of always pointing north;
/// [speedMetersPerSecond] is carried through for the same reason a
/// real GPS fix would include it (e.g. a future "arriving faster than
/// expected" ETA recompute) even though nothing reads it yet. Both are
/// optional because not every source of a location reading can supply
/// them (e.g. a coarse/backfilled position).
class CurrentLocation extends ValueObject {
  const CurrentLocation({
    required this.latitude,
    required this.longitude,
    required this.recordedAt,
    this.headingDegrees,
    this.speedMetersPerSecond,
  });

  final double latitude;
  final double longitude;

  /// When this position was recorded (device clock or server receipt
  /// time, depending on the future real implementation) — distinct
  /// from `ETA.calculatedAt`, which times the *estimate*, not the fix.
  final DateTime recordedAt;

  /// Compass bearing in degrees, `0` = north, `90` = east. `null` when
  /// the source can't provide direction of travel.
  final double? headingDegrees;

  /// `null` when the source can't provide speed.
  final double? speedMetersPerSecond;

  @override
  List<Object?> get props => [
    latitude,
    longitude,
    recordedAt,
    headingDegrees,
    speedMetersPerSecond,
  ];
}
