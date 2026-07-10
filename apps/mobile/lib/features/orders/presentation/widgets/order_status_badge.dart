import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_radius.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../order/models/order_status.dart';
import '../../models/order_display.dart';

/// Colored badge for an order's status. Resolves its color from
/// `context.colors` (the app's neutral `ColorScheme`) based on
/// `Order.status` — never a hardcoded `Color` literal, per the
/// project's rule that only the Design System picks colors (see the
/// feature README for why `OrderDisplay` itself doesn't store a
/// `statusColor`).
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
    final color = _colorFor(context, data.order.status);

    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.space12,
        vertical: AppSpacing.space4,
      ),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(AppRadius.radius8),
      ),
      child: Text(
        data.statusText,
        style: context.textStyles.bodySmall?.copyWith(
          color: color,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}
