/// The lifecycle status of a [TrackingSession] — deliberately separate
/// from `OrderStatus`: an Order reaching `OrderStatus.inProgress` is
/// what *allows* a tracking session to start (see
/// `ProviderOrderJourney`'s `startService` action), but the two aren't
/// the same state machine. A provider could pause live sharing (e.g.
/// backgrounded app, connectivity loss) without the underlying Order
/// leaving `inProgress`.
enum TrackingSessionStatus {
  /// The Order hasn't reached `inProgress` yet, or the provider hasn't
  /// started sharing their location — nothing to show on the map.
  notStarted,

  /// Actively receiving/simulating location updates.
  active,

  /// A session exists (the provider started the service) but location
  /// updates aren't currently flowing — e.g. the provider's connection
  /// dropped. Distinct from `ended` so the UI can show "reconnecting"
  /// rather than "arrived"/"finished".
  paused,

  /// The provider arrived, or the Order left `inProgress` — the session
  /// is over and no more updates will be emitted.
  ended,
}
