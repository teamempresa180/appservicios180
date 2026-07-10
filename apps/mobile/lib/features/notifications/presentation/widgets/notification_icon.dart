import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../models/notification_display.dart';

/// Resolves an icon (and its color) from a notification's `category`.
/// **No icon or color is stored in any model** — both are picked here,
/// purely from `NotificationCategory` and `context.colors.*` (the
/// app's neutral `ColorScheme`), at build time.
class NotificationIcon extends StatelessWidget {
  const NotificationIcon({super.key, required this.data});

  final NotificationDisplay data;

  IconData _iconFor(NotificationCategory category) {
    switch (category) {
      case NotificationCategory.order:
        return Icons.receipt_long_outlined;
      case NotificationCategory.payment:
        return Icons.payments_outlined;
      case NotificationCategory.quote:
        return Icons.request_quote_outlined;
      case NotificationCategory.chat:
        return Icons.chat_bubble_outline;
      case NotificationCategory.system:
        return Icons.info_outline;
    }
  }

  @override
  Widget build(BuildContext context) {
    return CircleAvatar(
      radius: AppSpacing.space20,
      backgroundColor: context.colors.primary.withValues(alpha: 0.12),
      child: Icon(_iconFor(data.category), color: context.colors.primary),
    );
  }
}
