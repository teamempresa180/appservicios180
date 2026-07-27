import 'package:flutter/material.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../../../../core/ui/widgets/app_snack_bar.dart';
import '../../models/provider_request_display.dart';
import '../../repositories/orders_repository.dart';
import '../view_models/provider_requests_view_model.dart';
import '../widgets/order_loading.dart';
import '../widgets/provider_requests_empty_state.dart';
import '../widgets/provider_requests_header.dart';
import '../widgets/provider_requests_list.dart';

/// Provider "Servicios" screen — replaces browsing/creating a service
/// catalog (that's the client's job) with the list of incoming client
/// requests the provider can accept or reject. Does NOT build its own
/// `Scaffold`, same as every other App Shell destination.
class ProviderRequestsPage extends StatefulWidget {
  const ProviderRequestsPage({super.key, OrdersRepository? repository})
    : _repository = repository;

  /// Overridable for tests only — production call sites always resolve
  /// the real repository from the service locator.
  final OrdersRepository? _repository;

  @override
  State<ProviderRequestsPage> createState() => _ProviderRequestsPageState();
}

class _ProviderRequestsPageState extends State<ProviderRequestsPage> {
  late final ProviderRequestsViewModel _viewModel = ProviderRequestsViewModel(
    widget._repository ?? locator<OrdersRepository>(),
  );

  String? _busyOrderId;
  String? _busyAction;

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

  Future<void> _accept(ProviderRequestDisplay request) async {
    setState(() {
      _busyOrderId = request.order.id.value;
      _busyAction = 'accept';
    });
    try {
      await _viewModel.accept(request);
      if (!mounted) return;
      AppSnackBar.show(
        context,
        'Aceptaste la solicitud de ${request.clientName}.',
        type: AppSnackBarType.success,
      );
    } finally {
      if (mounted) setState(() => _busyOrderId = null);
    }
  }

  Future<void> _reject(ProviderRequestDisplay request) async {
    setState(() {
      _busyOrderId = request.order.id.value;
      _busyAction = 'reject';
    });
    try {
      await _viewModel.reject(request);
      if (!mounted) return;
      AppSnackBar.show(
        context,
        'Rechazaste la solicitud de ${request.clientName}.',
        type: AppSnackBarType.info,
      );
    } finally {
      if (mounted) setState(() => _busyOrderId = null);
    }
  }

  Widget _buildBody() {
    switch (_viewModel.status) {
      case ProviderRequestsLoadStatus.loading:
        return const OrderLoading();
      case ProviderRequestsLoadStatus.error:
        return AppEmptyState(
          icon: AppIcons.error,
          title: 'No se pudieron cargar las solicitudes',
          description: _viewModel.errorMessage,
          actionLabel: 'Reintentar',
          onActionPressed: _viewModel.retry,
        );
      case ProviderRequestsLoadStatus.success:
        final requests = _viewModel.requests;
        return requests.isEmpty
            ? const ProviderRequestsEmptyState()
            : ProviderRequestsList(
                requests: requests,
                busyOrderId: _busyOrderId,
                busyAction: _busyAction,
                onAccept: _accept,
                onReject: _reject,
              );
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppPageBody(
      header: const ProviderRequestsHeader(),
      body: _buildBody(),
    );
  }
}
