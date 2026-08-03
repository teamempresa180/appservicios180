import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_chip.dart';
import '../../../../order/models/order_status.dart';

/// The tabs the Orders screen can show. Each one maps to a real set of
/// [OrderStatus]es (see [OrderTabFilter.matches]) — selecting a tab now
/// actually filters the list, instead of only changing which chip looks
/// selected. `all` is the default so a client never lands on a screen
/// that hides the orders they just created.
enum OrderTab { all, pending, inProgress, completed, cancelled }

extension OrderTabLabel on OrderTab {
  String get label {
    switch (this) {
      case OrderTab.all:
        return 'Todas';
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

  /// Copy for the empty state shown when this tab has no orders but
  /// others do — a generic "aún no tienes órdenes" would be wrong (and
  /// confusing) there.
  String get emptyMessage {
    switch (this) {
      case OrderTab.all:
        return 'Cuando solicites un servicio, tus órdenes aparecerán aquí.';
      case OrderTab.pending:
        return 'No tienes solicitudes pendientes en este momento.';
      case OrderTab.inProgress:
        return 'No tienes servicios en progreso en este momento.';
      case OrderTab.completed:
        return 'Todavía no tienes servicios finalizados.';
      case OrderTab.cancelled:
        return 'No tienes solicitudes canceladas.';
    }
  }
}

extension OrderTabFilter on OrderTab {
  /// Whether an order with [status] belongs under this tab. `rejected`
  /// is grouped with `cancelled` — from the client's point of view both
  /// mean "esta solicitud no siguió adelante".
  bool matches(OrderStatus status) {
    switch (this) {
      case OrderTab.all:
        return true;
      case OrderTab.pending:
        return status == OrderStatus.pending;
      case OrderTab.inProgress:
        return status == OrderStatus.accepted ||
            status == OrderStatus.inProgress;
      case OrderTab.completed:
        return status == OrderStatus.completed;
      case OrderTab.cancelled:
        return status == OrderStatus.cancelled ||
            status == OrderStatus.rejected;
    }
  }
}

/// Tab selector for the Orders screen. Stateless and fully controlled by
/// its parent (`OrdersPage`), which owns the selection and applies the
/// real filter — the same pattern `ConversationFilterTabs` already uses
/// on the Mensajes screen.
class OrderStatusTabs extends StatelessWidget {
  const OrderStatusTabs({
    super.key,
    required this.selected,
    required this.onChanged,
    this.countFor,
  });

  final OrderTab selected;
  final ValueChanged<OrderTab> onChanged;

  /// Optional per-tab count appended to the chip label, so the client
  /// can see where their orders are without tapping through every tab.
  final int Function(OrderTab tab)? countFor;

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: [
          for (final tab in OrderTab.values) ...[
            AppChip(
              label: countFor == null
                  ? tab.label
                  : '${tab.label} (${countFor!(tab)})',
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
