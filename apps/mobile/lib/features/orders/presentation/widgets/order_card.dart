import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/order_progress.dart';
import '../../../../order/journey/order_journey_info.dart';
import '../../../../order/journey/order_journey_stage.dart';
import '../../models/order_display.dart';
import 'order_actions.dart';
import 'order_status_badge.dart';
import 'order_summary.dart';

/// A single order card: status badge, service/provider/date/price
/// summary, the full `OrderProgress` timeline plus the
/// `ClientOrderJourney`-derived title/description/help text for
/// [journey]'s current stage, and — if [journey] has any — the exact
/// buttons valid for this order right now (never more, never less; see
/// `OrderActions`). Composes `OrderStatusBadge` + `OrderSummary` +
/// `OrderProgress` + `OrderActions` inside a single `AppCard`.
class OrderCard extends StatelessWidget {
  const OrderCard({
    super.key,
    required this.data,
    required this.journey,
    this.onChanged,
  });

  final OrderDisplay data;
  final OrderJourneyInfo journey;

  /// Called after a state-changing action (e.g. cancelling) completes,
  /// so the caller can reload the list.
  final VoidCallback? onChanged;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(child: OrderSummary(data: data)),
              OrderStatusBadge(data: data),
            ],
          ),
          const SizedBox(height: AppSpacing.space16),
          OrderProgress(
            stages: OrderJourneyStage.values,
            current: journey.stage,
            cancelled: journey.cancelled,
          ),
          const SizedBox(height: AppSpacing.space12),
          Text(journey.title, style: context.textStyles.titleSmall),
          const SizedBox(height: AppSpacing.space4),
          Text(journey.description, style: context.textStyles.bodyMedium),
          if (journey.helpMessage.isNotEmpty) ...[
            const SizedBox(height: AppSpacing.space4),
            Text(
              journey.helpMessage,
              style: context.textStyles.bodySmall?.copyWith(
                color: context.colors.secondary,
              ),
            ),
          ],
          if (journey.actions.isNotEmpty) ...[
            const SizedBox(height: AppSpacing.space16),
            OrderActions(data: data, journey: journey, onChanged: onChanged),
          ],
        ],
      ),
    );
  }
}
