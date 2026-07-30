import 'package:flutter/material.dart';
import '../../../../core/ui/animations/fade_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/tokens/app_durations.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../order/entities/order.dart';
import '../../../../order/journey/order_journey_info.dart';
import '../../models/order_display.dart';
import 'order_card.dart';

/// Vertical list of `OrderCard`s, entering with a staggered fade+slide
/// (see `staggerDelayFor`). Each card gets its own derived
/// [OrderJourneyInfo] via [journeyFor] (see `OrdersViewModel`, the only
/// place that builds it) — this widget stays a thin, stateless
/// presenter, never deriving journey copy itself.
class OrdersList extends StatelessWidget {
  const OrdersList({
    super.key,
    required this.orders,
    required this.journeyFor,
    this.onOrderChanged,
  });

  final List<OrderDisplay> orders;
  final OrderJourneyInfo Function(Order order) journeyFor;

  /// Called after a state-changing action on any card (e.g. cancelling
  /// an order) completes, so the caller can reload the whole list.
  final VoidCallback? onOrderChanged;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        for (final (index, order) in orders.indexed) ...[
          FadeIn(
            delay: staggerDelayFor(index),
            child: SlideIn(
              child: OrderCard(
                data: order,
                journey: journeyFor(order.order),
                onChanged: onOrderChanged,
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.space12),
        ],
      ],
    );
  }
}
