import '../../../core/base/value_object.dart';

/// An estimated arrival time, paired with the moment it was calculated
/// — so callers can tell a fresh estimate from a stale one instead of
/// trusting [arrivalTime] blindly forever. A future real-time backend
/// recalculates this on every location update (traffic, route
/// deviation, etc.), so [calculatedAt] matters even though today's
/// `MockTrackingRepository` recalculates on a fixed timer.
class ETA extends ValueObject {
  const ETA({required this.arrivalTime, required this.calculatedAt});

  /// The estimated arrival date/time.
  final DateTime arrivalTime;

  /// When this estimate was produced — compare against "now" via
  /// [isStaleAt] rather than assuming every reading is current.
  final DateTime calculatedAt;

  /// Minutes from [calculatedAt] to [arrivalTime], floored at zero —
  /// what `TrackingInfoPanel` shows today as "Llega en N min".
  int get minutesRemaining {
    final diff = arrivalTime.difference(calculatedAt).inSeconds;
    return diff <= 0 ? 0 : (diff / 60).ceil();
  }

  /// `true` once [now] is far enough past [calculatedAt] that this
  /// estimate shouldn't be trusted without a refresh — relevant once a
  /// real-time channel exists and updates can be delayed or dropped.
  bool isStaleAt(
    DateTime now, {
    Duration staleAfter = const Duration(seconds: 30),
  }) {
    return now.difference(calculatedAt) > staleAfter;
  }

  @override
  List<Object?> get props => [arrivalTime, calculatedAt];
}
