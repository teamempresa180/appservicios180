import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../../mock/mock_notifications_data.dart';
import '../../models/notification_display.dart';
import '../../repositories/mock_notifications_repository.dart';
import '../widgets/notification_filter_tabs.dart';
import '../widgets/notifications_empty_state.dart';
import '../widgets/notifications_header.dart';
import '../widgets/notifications_list.dart';
import '../widgets/notifications_loading.dart';

/// The three purely-visual states this screen can render — same
/// fixed-`state` approach as `OrdersPage`/`PaymentsPage`/`ChatPage`, no
/// real async fetch, no state management.
enum NotificationsViewState { loading, empty, list }

/// Relative-time label for a fixed mock timestamp against a fixed
/// reference "now" (`mockNotificationsNow`) — there is no live clock
/// here, see the feature README.
String _timeAgo(DateTime from, DateTime now) {
  final difference = now.difference(from);
  if (difference.inMinutes < 1) return 'Ahora mismo';
  if (difference.inMinutes < 60) return 'Hace ${difference.inMinutes} min';
  if (difference.inHours < 24) return 'Hace ${difference.inHours} h';
  return 'Hace ${difference.inDays} días';
}

/// Notifications screen. Does NOT build its own `Scaffold` — it is
/// meant to live within the existing navigation flow, the same way
/// every other feature so far does. Completely independent: its own
/// repository, its own mock data.
///
/// Shows a fixed list of notifications (no id-based lookup yet) — see
/// the feature README.
class NotificationsPage extends StatelessWidget {
  const NotificationsPage({
    super.key,
    this.state = NotificationsViewState.list,
  });

  final NotificationsViewState state;

  List<NotificationDisplay> _buildNotifications() {
    final repository = MockNotificationsRepository();

    return [
      for (final notification in repository.getNotifications())
        NotificationDisplay(
          notification: notification,
          order: repository.getOrderFor(notification),
          payment: repository.getPaymentFor(notification),
          quote: repository.getQuoteFor(notification),
          chat: repository.getChatFor(notification),
          timeAgo: _timeAgo(notification.createdAt, mockNotificationsNow),
        ),
    ];
  }

  Widget _buildBody() {
    switch (state) {
      case NotificationsViewState.loading:
        return const NotificationsLoading();
      case NotificationsViewState.empty:
        return const NotificationsEmptyState();
      case NotificationsViewState.list:
        return NotificationsList(notifications: _buildNotifications());
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppPageBody(
      header: const NotificationsHeader(),
      toolbar: const [NotificationFilterTabs()],
      body: _buildBody(),
    );
  }
}
