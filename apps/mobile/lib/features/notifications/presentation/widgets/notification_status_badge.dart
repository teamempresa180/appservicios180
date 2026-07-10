import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../models/notification_display.dart';

/// A small unread indicator dot. `isUnread` is **derived** from
/// `Notification.status`, not stored/simulated. Resolves its color from
/// `context.colors` — never a hardcoded `Color` literal, same rule
/// already applied in `OrderStatusBadge`/`PaymentStatusBadge`. Renders
/// nothing when the notification is already read.
class NotificationStatusBadge extends StatelessWidget {
  const NotificationStatusBadge({super.key, required this.data});

  final NotificationDisplay data;

  @override
  Widget build(BuildContext context) {
    if (!data.isUnread) return const SizedBox.shrink();

    return Container(
      width: AppSpacing.space8,
      height: AppSpacing.space8,
      decoration: BoxDecoration(
        color: context.colors.primary,
        shape: BoxShape.circle,
      ),
    );
  }
}
