import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';

/// The five purely-visual tabs this screen can show. No real filtering
/// happens when a tab is selected — see the feature README (same
/// approach as `OrderStatusTabs` in `orders`).
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

/// Tab selector for the Notifications screen. **Purely visual** —
/// selecting a tab only changes which tab looks selected; it does not
/// filter `NotificationsList`.
class NotificationFilterTabs extends StatefulWidget {
  const NotificationFilterTabs({
    super.key,
    this.initialTab = NotificationTab.all,
  });

  final NotificationTab initialTab;

  @override
  State<NotificationFilterTabs> createState() => _NotificationFilterTabsState();
}

class _NotificationFilterTabsState extends State<NotificationFilterTabs> {
  late NotificationTab _selected;

  @override
  void initState() {
    super.initState();
    _selected = widget.initialTab;
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: [
          for (final tab in NotificationTab.values) ...[
            ChoiceChip(
              label: Text(tab.label),
              selected: _selected == tab,
              onSelected: (_) => setState(() => _selected = tab),
            ),
            const SizedBox(width: AppSpacing.space8),
          ],
        ],
      ),
    );
  }
}
