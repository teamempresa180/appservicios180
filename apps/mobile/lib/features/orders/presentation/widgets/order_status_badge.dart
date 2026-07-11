import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/widgets/app_badge.dart';
import '../../../../order/models/order_status.dart';
import '../../models/order_display.dart';

/// Colored badge for an order's status. Resolves its color from
/// `context.colors` (the app's neutral `ColorScheme`) based on
/// `Order.status` — never a hardcoded `Color` literal, per the
/// project's rule that only the Design System picks colors (see the
/// feature README for why `OrderDisplay` itself doesn't store a
/// `statusColor`). Renders via `AppBadge`.
class OrderStatusBadge extends StatelessWidget {
  const OrderStatusBadge({super.key, required this.data});

  final OrderDisplay data;

  Color _colorFor(BuildContext context, OrderStatus status) {
    switch (status) {
      case OrderStatus.pending:
        return context.colors.secondary;
      case OrderStatus.accepted:
      case OrderStatus.inProgress:
        return context.colors.primary;
      case OrderStatus.completed:
        return context.colors.primary;
      case OrderStatus.cancelled:
      case OrderStatus.rejected:
        return context.colors.error;
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppBadge(
      label: data.statusText,
      color: _colorFor(context, data.order.status),
    );
  }
}
