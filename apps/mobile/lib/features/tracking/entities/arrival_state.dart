/// How close the provider is to the client's destination, derived from
/// [DistanceRemaining] — a small state machine the UI reads directly
/// instead of re-deriving thresholds from raw meters in multiple
/// places (see `TrackingInfoPanel`/`TrackingMap`, which both care about
/// "is the provider basically here yet").
enum ArrivalState {
  /// The tracking session hasn't started (`TrackingSessionStatus
  /// .notStarted`) — there's no position to judge distance from yet.
  notStarted,

  /// Actively moving toward the destination, farther than
  /// [ArrivalStateThresholds.nearbyMeters] away.
  enRoute,

  /// Within [ArrivalStateThresholds.nearbyMeters] of the destination
  /// but not yet arrived — worth telling the client "your provider is
  /// almost there" instead of a plain ETA.
  nearby,

  /// Reached the destination — the session is expected to end shortly
  /// after (see `TrackingSessionStatus.ended`).
  arrived,
}

/// Thresholds used to derive an [ArrivalState] from a distance — kept
/// as named constants (not magic numbers scattered across call sites)
/// since a future real backend will need the exact same cutoffs to
/// decide when to notify the client.
abstract final class ArrivalStateThresholds {
  /// Below this distance, the provider is considered "nearby" rather
  /// than merely "en route".
  static const double nearbyMeters = 500;

  /// Below this distance, the provider is considered to have arrived.
  static const double arrivedMeters = 15;

  /// Derives an [ArrivalState] from a distance in meters and whether a
  /// session has actually started — a `0`-meter reading before the
  /// session starts must not read as "arrived".
  static ArrivalState fromDistanceMeters(
    double meters, {
    required bool sessionStarted,
  }) {
    if (!sessionStarted) return ArrivalState.notStarted;
    if (meters <= arrivedMeters) return ArrivalState.arrived;
    if (meters <= nearbyMeters) return ArrivalState.nearby;
    return ArrivalState.enRoute;
  }
}
