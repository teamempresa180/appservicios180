import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_chip.dart';

/// The four purely-visual tabs this screen can show. No real filtering
/// happens when a tab is selected — see the feature README.
enum OrderTab { pending, inProgress, completed, cancelled }

extension OrderTabLabel on OrderTab {
  String get label {
    switch (this) {
      case OrderTab.pending:
        return 'Pendientes';
      case OrderTab.inProgress:
        return 'En progreso';
      case OrderTab.completed:
        return 'Finalizadas';
      case OrderTab.cancelled:
        return 'Canceladas';
    }
  }
}

/// Tab selector for the Orders screen. **Purely visual** — selecting a
/// tab only changes which tab looks selected; it does not filter
/// `OrdersList` (see the feature README, and `PrioritySelector` in
/// `request_service` for the same local-state-only pattern).
class OrderStatusTabs extends StatefulWidget {
  const OrderStatusTabs({super.key, this.initialTab = OrderTab.pending});

  final OrderTab initialTab;

  @override
  State<OrderStatusTabs> createState() => _OrderStatusTabsState();
}

class _OrderStatusTabsState extends State<OrderStatusTabs> {
  late OrderTab _selected;

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
          for (final tab in OrderTab.values) ...[
            AppChip(
              label: tab.label,
              selected: _selected == tab,
              onTap: () => setState(() => _selected = tab),
            ),
            const SizedBox(width: AppSpacing.space8),
          ],
        ],
      ),
    );
  }
}
