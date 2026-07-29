import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../models/notification_display.dart';
import 'notification_actions.dart';
import 'notification_icon.dart';
import 'notification_status_badge.dart';

/// A single notification card: icon, title, description, relative
/// date, unread indicator and the category-dependent action button.
class NotificationCard extends StatelessWidget {
  const NotificationCard({super.key, required this.data});

  final NotificationDisplay data;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          NotificationIcon(data: data),
          const SizedBox(width: AppSpacing.space12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        data.title,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: context.textStyles.titleSmall,
                      ),
                    ),
                    NotificationStatusBadge(data: data),
                  ],
                ),
                const SizedBox(height: AppSpacing.space4),
                Text(
                  data.description,
                  maxLines: 3,
                  overflow: TextOverflow.ellipsis,
                  style: context.textStyles.bodyMedium,
                ),
                const SizedBox(height: AppSpacing.space4),
                Text(data.timeAgo, style: context.textStyles.bodySmall),
                const SizedBox(height: AppSpacing.space8),
                NotificationActions(data: data),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
