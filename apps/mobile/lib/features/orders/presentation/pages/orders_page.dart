import 'package:flutter/material.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';
import '../../repositories/orders_repository.dart';
import '../view_models/orders_view_model.dart';
import '../widgets/order_empty_state.dart';
import '../widgets/order_loading.dart';
import '../widgets/order_status_tabs.dart';
import '../widgets/orders_header.dart';
import '../widgets/orders_list.dart';
import '../../../../core/ui/widgets/app_page_body.dart';

/// Orders screen. Does NOT build its own `Scaffold` — it is meant to
/// live inside the App Shell later, the same way Home, Marketplace,
/// Categories and Search already do. Loads from the real backend via
/// [OrdersViewModel] (resolved from the service locator — see
/// `core/di/service_locator.dart`).
class OrdersPage extends StatefulWidget {
  const OrdersPage({super.key, OrdersRepository? repository})
    : _repository = repository;

  /// Overridable for tests only — production call sites always resolve
  /// the real repository from the service locator.
  final OrdersRepository? _repository;

  @override
  State<OrdersPage> createState() => _OrdersPageState();
}

class _OrdersPageState extends State<OrdersPage> {
  late final OrdersViewModel _viewModel = OrdersViewModel(
    widget._repository ?? locator<OrdersRepository>(),
  );

  @override
  void initState() {
    super.initState();
    _viewModel.load();
    _viewModel.addListener(_onViewModelChanged);
  }

  void _onViewModelChanged() => setState(() {});

  @override
  void dispose() {
    _viewModel.removeListener(_onViewModelChanged);
    _viewModel.dispose();
    super.dispose();
  }

  Widget _buildBody() {
    switch (_viewModel.status) {
      case OrdersLoadStatus.loading:
        return const OrderLoading();
      case OrdersLoadStatus.error:
        return AppEmptyState(
          icon: AppIcons.error,
          title: 'No se pudieron cargar las órdenes',
          description: _viewModel.errorMessage,
          actionLabel: 'Reintentar',
          onActionPressed: _viewModel.retry,
        );
      case OrdersLoadStatus.success:
        return _viewModel.orders.isEmpty
            ? const OrderEmptyState()
            : OrdersList(orders: _viewModel.orders);
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
