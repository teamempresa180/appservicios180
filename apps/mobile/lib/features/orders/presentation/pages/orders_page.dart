import 'package:flutter/material.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';
import '../../../quote/repositories/quote_repository.dart';
import '../../../reviews/repositories/reviews_repository.dart';
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
  const OrdersPage({
    super.key,
    OrdersRepository? repository,
    QuoteRepository? quoteRepository,
    ReviewsRepository? reviewsRepository,
  }) : _repository = repository,
       _quoteRepository = quoteRepository,
       _reviewsRepository = reviewsRepository;

  /// Overridable for tests only — production call sites always resolve
  /// the real repositories from the service locator.
  final OrdersRepository? _repository;
  final QuoteRepository? _quoteRepository;
  final ReviewsRepository? _reviewsRepository;

  @override
  State<OrdersPage> createState() => _OrdersPageState();
}

class _OrdersPageState extends State<OrdersPage> {
  late final OrdersViewModel _viewModel = OrdersViewModel(
    widget._repository ?? locator<OrdersRepository>(),
    quoteRepository: widget._quoteRepository ?? locator<QuoteRepository>(),
    reviewsRepository:
        widget._reviewsRepository ?? locator<ReviewsRepository>(),
  );

  @override
  void initState() {
    super.initState();
    _viewModel.load();
    _viewModel.addListener(_onViewModelChanged);
  }

  OrderTab _selectedTab = OrderTab.all;

  void _onViewModelChanged() => setState(() {});

  @override
  void dispose() {
    _viewModel.removeListener(_onViewModelChanged);
    _viewModel.dispose();
    super.dispose();
  }

  int _countFor(OrderTab tab) => _viewModel.orders
      .where((display) => tab.matches(display.order.status))
      .length;

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
        final filtered = _viewModel.orders
            .where((display) => _selectedTab.matches(display.order.status))
            .toList();
        if (filtered.isEmpty) {
          // Distinguishes "you have no orders at all" from "this filter
          // is empty but others aren't" — the second used to render the
          // same "Sin órdenes todavía" copy, which read as if the
          // client's orders had disappeared.
          final hasAnyOrder = _viewModel.orders.isNotEmpty;
          return OrderEmptyState(
            title: hasAnyOrder
                ? 'Nada en "${_selectedTab.label}"'
                : 'Sin órdenes todavía',
            description: _selectedTab.emptyMessage,
          );
        }
        return OrdersList(
          orders: filtered,
          journeyFor: _viewModel.journeyFor,
          onOrderChanged: _viewModel.retry,
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    final showCounts = _viewModel.status == OrdersLoadStatus.success;
    return AppPageBody(
      header: const OrdersHeader(),
      toolbar: [
        OrderStatusTabs(
          selected: _selectedTab,
          onChanged: (tab) => setState(() => _selectedTab = tab),
          countFor: showCounts ? _countFor : null,
        ),
      ],
      body: _buildBody(),
    );
  }
}
