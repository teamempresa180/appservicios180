import 'order_journey_action.dart';
import 'order_journey_stage.dart';

/// Everything a status screen needs to render "what's happening and
/// what can I do about it" for one `Order`, from one role's viewpoint
/// (client or provider) — title, description, a short help message,
/// which [OrderJourneyStage] the timeline should highlight as current,
/// and the exact list of valid actions for this moment (never more,
/// never less — see `ClientOrderJourney`/`ProviderOrderJourney`, the
/// only two places that construct this).
class OrderJourneyInfo {
  const OrderJourneyInfo({
    required this.stage,
    required this.title,
    required this.description,
    required this.helpMessage,
    required this.actions,
    this.cancelled = false,
  });

  /// Current stage on the shared timeline — meaningless when
  /// [cancelled] is `true` (a cancelled/rejected order isn't
  /// progressing through the happy-path stages anymore).
  final OrderJourneyStage stage;
  final String title;
  final String description;
  final String helpMessage;
  final List<OrderJourneyAction> actions;
  final bool cancelled;
}
