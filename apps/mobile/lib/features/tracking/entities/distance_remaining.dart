import '../../../core/base/value_object.dart';

/// Distance left between the provider's current position and the
/// client's destination. Kept deliberately simple — a single `double`
/// in meters plus a display helper — rather than a general unit-aware
/// quantity type: nothing in this app needs miles/feet, and adding a
/// unit enum today would just be speculative generality.
class DistanceRemaining extends ValueObject {
  const DistanceRemaining(this.meters);

  final double meters;

  /// `"850 m"` below 1km, `"1.2 km"` at or above it — the same
  /// formatting `TrackingInfoPanel` already used for `distanceMeters`
  /// before this type existed.
  String get formatted {
    if (meters >= 1000) return '${(meters / 1000).toStringAsFixed(1)} km';
    return '${meters.round()} m';
  }

  @override
  List<Object?> get props => [meters];
}
