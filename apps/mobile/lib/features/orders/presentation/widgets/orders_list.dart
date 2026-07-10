import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../models/order_display.dart';
import 'order_card.dart';

/// Vertical list of `OrderCard`s. Purely visual — see the feature
/// README for why this always shows the same fixed mock orders
/// regardless of the selected `OrderStatusTabs` tab.
class OrdersList extends StatelessWidget {
  const OrdersList({super.key, required this.orders});

  final List<OrderDisplay> orders;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        for (final order in orders) ...[
          OrderCard(data: order),
          const SizedBox(height: AppSpacing.space12),
        ],
      ],
    );
  }
}
