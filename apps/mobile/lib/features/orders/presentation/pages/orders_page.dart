import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../../mock/mock_orders_data.dart';
import '../../models/order_display.dart';
import '../../repositories/mock_orders_repository.dart';
import '../widgets/order_empty_state.dart';
import '../widgets/order_loading.dart';
import '../widgets/order_status_tabs.dart';
import '../widgets/orders_header.dart';
import '../widgets/orders_list.dart';

/// The three purely-visual states this screen can render. Selecting a
/// tab in `OrderStatusTabs` does not change this — see the feature
/// README.
enum OrdersViewState { loading, empty, list }

/// Orders screen. Does NOT build its own `Scaffold` — it is meant to
/// live inside the App Shell later, the same way Home, Marketplace,
/// Categories and Search already do. Completely independent of every
/// other feature: its own repository, its own mock data.
///
/// [state] only picks which of the three visual states renders — there
/// is no real async fetch, no state management, just a fixed switch for
/// previewing each state (same approach as `SearchPage.state`).
class OrdersPage extends StatelessWidget {
  const OrdersPage({super.key, this.state = OrdersViewState.list});

  final OrdersViewState state;

  List<OrderDisplay> _buildOrders() {
    final repository = MockOrdersRepository();

    return [
      for (final order in repository.getOrders())
        OrderDisplay(
          order: order,
          service: repository.getServiceFor(order),
          provider: repository.getProviderFor(order),
          profile: repository.getProfileFor(order),
          category: repository.getCategoryFor(order),
          quote: repository.getQuoteFor(order),
          estimatedArrival: mockOrderEstimatedArrival[order.id]!,
        ),
    ];
  }

  Widget _buildBody() {
    switch (state) {
      case OrdersViewState.loading:
        return const OrderLoading();
      case OrdersViewState.empty:
        return const OrderEmptyState();
      case OrdersViewState.list:
        return OrdersList(orders: _buildOrders());
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppPageBody(
      header: const OrdersHeader(),
      toolbar: const [OrderStatusTabs()],
      body: _buildBody(),
    );
  }
}
