import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/widgets/app_badge.dart';
import '../../../../payment/models/payment_status.dart';
import '../../models/payment_display.dart';

/// Colored badge for a payment's status. Resolves its color from
/// `context.colors` (the app's neutral `ColorScheme`) based on
/// `Payment.status` — never a hardcoded `Color` literal, per the
/// project's rule that only the Design System picks colors (same
/// approach as `OrderStatusBadge` — see the feature README for why
/// `PaymentDisplay` itself doesn't store a `statusColor`). Renders via
/// `AppBadge`.
class PaymentStatusBadge extends StatelessWidget {
  const PaymentStatusBadge({super.key, required this.data});

  final PaymentDisplay data;

  Color _colorFor(BuildContext context, PaymentStatus status) {
    switch (status) {
      case PaymentStatus.pending:
        return context.colors.secondary;
      case PaymentStatus.completed:
        return context.colors.primary;
      case PaymentStatus.failed:
      case PaymentStatus.cancelled:
        return context.colors.error;
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppBadge(
      label: data.statusText,
      color: _colorFor(context, data.payment.status),
    );
  }
}
