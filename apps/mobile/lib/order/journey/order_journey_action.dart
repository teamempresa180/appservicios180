/// The kind of next action a journey stage suggests. Purely descriptive
/// — the feature screen that renders an [OrderJourneyAction] owns
/// actually wiring its button to a repository call; this module never
/// calls a repository itself, so it stays a single source of truth for
/// "what's the right label/action for this state" without duplicating
/// that decision across screens.
enum OrderJourneyActionKind {
  viewQuotes,
  acceptQuote,
  cancelOrder,
  startService,
  completeService,
  rateProvider,
  submitQuote,
  openChat,
}

/// A single suggested action for the current stage, with the label the
/// button should show. Two orders in the exact same stage always get
/// the exact same actions — no per-screen guessing of what's allowed.
class OrderJourneyAction {
  const OrderJourneyAction(this.kind, this.label);

  final OrderJourneyActionKind kind;
  final String label;
}
