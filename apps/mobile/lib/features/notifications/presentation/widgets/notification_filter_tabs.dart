import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_chip.dart';

/// The five tabs this screen can show — see `NotificationsPage` for how
/// [NotificationTab] maps to a real filter over the loaded list.
enum NotificationTab { all, unread, orders, payments, messages }

extension NotificationTabLabel on NotificationTab {
  String get label {
    switch (this) {
      case NotificationTab.all:
        return 'Todas';
      case NotificationTab.unread:
        return 'No leídas';
      case NotificationTab.orders:
        return 'Pedidos';
      case NotificationTab.payments:
        return 'Pagos';
      case NotificationTab.messages:
        return 'Mensajes';
    }
  }
}

/// Controlled tab selector for the Notifications screen — [selected]/
/// [onChanged] are owned by the caller (`NotificationsPage`), which
/// filters `NotificationsList` accordingly.
class NotificationFilterTabs extends StatelessWidget {
  const NotificationFilterTabs({
    super.key,
    required this.selected,
    required this.onChanged,
  });

  final NotificationTab selected;
  final ValueChanged<NotificationTab> onChanged;

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: [
          for (final tab in NotificationTab.values) ...[
            AppChip(
              label: tab.label,
              selected: selected == tab,
              onTap: () => onChanged(tab),
            ),
            const SizedBox(width: AppSpacing.space8),
          ],
        ],
      ),
    );
  }
}
