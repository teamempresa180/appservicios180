import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/order_progress.dart';
import '../../../../order/journey/order_journey_info.dart';
import '../../../../order/journey/order_journey_stage.dart';
import '../../../orders/models/order_display.dart';
import '../../../orders/presentation/widgets/order_actions.dart';

/// Compact "most important active order" card shown at the top of
/// Cliente Home (see `ClientHomeOrdersViewModel`) — the guided-journey
/// entry point for a client who already has something in flight. Reuses
/// the exact same `OrderProgress` timeline and `ClientOrderJourney`
/// title/description every client-facing order screen shows, but trims
/// the action row down to just [journey]'s single most relevant action
/// (Home is a summary, not a full status page — the complete set of
/// valid actions still shows on this same order's card in the Orders
/// list, reached by tapping anywhere else on this card via [onTap]).
class HomeActiveOrderCard extends StatelessWidget {
  const HomeActiveOrderCard({
    super.key,
    required this.data,
    required this.journey,
    this.onTap,
    this.onChanged,
  });

  final OrderDisplay data;
  final OrderJourneyInfo journey;

  /// Opens the full Orders list, where this same order shows every
  /// valid action — not just the one trimmed down to here.
  final VoidCallback? onTap;

  /// Forwarded to the trimmed `OrderActions` — called after its one
  /// action (e.g. cancelling) completes, so Home can reload.
  final VoidCallback? onChanged;

  @override
  Widget build(BuildContext context) {
    final primaryOnly = journey.actions.isEmpty
        ? journey
        : OrderJourneyInfo(
            stage: journey.stage,
            title: journey.title,
            description: journey.description,
            helpMessage: journey.helpMessage,
            actions: [journey.actions.first],
            cancelled: journey.cancelled,
          );

    return AppCard(
      onTap: onTap,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            data.service?.name ?? data.category.name,
            style: context.textStyles.titleSmall,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: AppSpacing.space4),
          Text(
            data.providerName,
            style: context.textStyles.bodySmall,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
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
          if (primaryOnly.actions.isNotEmpty) ...[
            const SizedBox(height: AppSpacing.space16),
            OrderActions(
              data: data,
              journey: primaryOnly,
              onChanged: onChanged,
            ),
          ],
        ],
      ),
    );
  }
}
