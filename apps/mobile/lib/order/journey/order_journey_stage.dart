/// The linear lifecycle stages of an Order's service journey, shared by
/// both the client and provider experience — this is the "spine" the
/// reusable `OrderProgress`/timeline widget (see
/// `core/ui/widgets/order_progress.dart`) renders. Which stage is
/// actually *current* for a given `Order`, plus the role-specific
/// title/description/actions shown alongside it, is derived separately
/// (see `client_order_journey.dart`/`provider_order_journey.dart`) so
/// this enum stays presentation-neutral and free of any `Order`/`Quote`
/// import — safe for `core/ui/widgets` to depend on directly.
///
/// [onTheWay] has no backend/data signal behind it yet (no live
/// location, no WebSocket) — it exists purely so the timeline already
/// has a slot for it, per the explicit "prepare, don't implement"
/// instruction for this stage. Nothing in this codebase currently
/// derives it as the *current* stage; it only ever renders as an
/// upcoming step, ready for a future real-time pass to light it up.
enum OrderJourneyStage {
  requested,
  awaitingQuotes,
  quotesReceived,
  accepted,
  scheduled,
  onTheWay,
  inProgress,
  completed,
  awaitingRating,
  done;

  /// Short, role-neutral label for the compact timeline step — the
  /// bigger, role-specific copy (title/description/help message) lives
  /// in `OrderJourneyInfo`, not here.
  String get shortLabel => switch (this) {
    OrderJourneyStage.requested => 'Solicitud',
    OrderJourneyStage.awaitingQuotes => 'Cotizando',
    OrderJourneyStage.quotesReceived => 'Cotizaciones',
    OrderJourneyStage.accepted => 'Asignado',
    OrderJourneyStage.scheduled => 'Programado',
    OrderJourneyStage.onTheWay => 'En camino',
    OrderJourneyStage.inProgress => 'En progreso',
    OrderJourneyStage.completed => 'Finalizado',
    OrderJourneyStage.awaitingRating => 'Calificación',
    OrderJourneyStage.done => 'Completado',
  };
}
