import 'package:flutter/material.dart';
import '../../../../core/ui/animations/fade_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/tokens/app_durations.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../models/notification_display.dart';
import 'notification_card.dart';

/// Vertical list of `NotificationCard`s, entering with a staggered
/// fade+slide (see `staggerDelayFor`). Purely visual — see the feature
/// README for why this always shows the same fixed mock notifications
/// regardless of the selected `NotificationFilterTabs` tab.
class NotificationsList extends StatelessWidget {
  const NotificationsList({super.key, required this.notifications});

  final List<NotificationDisplay> notifications;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        for (final (index, notification) in notifications.indexed) ...[
          FadeIn(
            delay: staggerDelayFor(index),
            child: SlideIn(child: NotificationCard(data: notification)),
          ),
          const SizedBox(height: AppSpacing.space12),
        ],
      ],
    );
  }
}
