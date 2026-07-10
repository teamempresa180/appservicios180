import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../models/order_display.dart';
import 'order_actions.dart';
import 'order_status_badge.dart';
import 'order_summary.dart';

/// A single order card: status badge, service/provider/date/price
/// summary, and the status-dependent main action. Composes
/// `OrderStatusBadge` + `OrderSummary` + `OrderActions` inside a single
/// `AppCard`.
class OrderCard extends StatelessWidget {
  const OrderCard({super.key, required this.data});

  final OrderDisplay data;

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
          const SizedBox(height: AppSpacing.space12),
          OrderActions(data: data),
        ],
      ),
    );
  }
}
