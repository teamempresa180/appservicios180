import 'package:flutter/material.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/network/http_exceptions.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../../../core/ui/widgets/app_dialog.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../../../../core/ui/widgets/app_snack_bar.dart';
import '../../../chat/presentation/pages/chat_page.dart';
import '../../../chat/repositories/chat_repository.dart';
import '../../../reviews/repositories/reviews_repository.dart';
import '../../models/provider_request_display.dart';
import '../../repositories/orders_repository.dart';
import '../view_models/provider_requests_view_model.dart';
import '../widgets/order_loading.dart';
import '../widgets/provider_requests_empty_state.dart';
import '../widgets/provider_requests_header.dart';
import '../widgets/provider_requests_list.dart';
import '../widgets/submit_quote_sheet.dart';

/// Provider "Servicios" screen — every Order relevant to this provider
/// (`ProviderRequestsViewModel.activeRequests`/`historyRequests`, both
/// derived from `OrdersRepository.getRelevantOrders()`), not the old
/// unfiltered/unscoped list. Does NOT build its own `Scaffold`, same as
/// every other App Shell destination.
class ProviderRequestsPage extends StatefulWidget {
  const ProviderRequestsPage({
    super.key,
    OrdersRepository? repository,
    ReviewsRepository? reviewsRepository,
    ChatRepository? chatRepository,
    this.initialTab = ProviderRequestsTab.active,
  }) : _repository = repository,
       _reviewsRepository = reviewsRepository,
       _chatRepository = chatRepository;

  /// Overridable for tests only — production call sites always resolve
  /// the real repositories from the service locator.
  final OrdersRepository? _repository;
  final ReviewsRepository? _reviewsRepository;
  final ChatRepository? _chatRepository;

  /// Which tab to open on — lets a caller (e.g. the Provider Dashboard's
  /// "Ver historial" link) land straight on `Historial` instead of
  /// always starting on `Activas`.
  final ProviderRequestsTab initialTab;

  @override
  State<ProviderRequestsPage> createState() => _ProviderRequestsPageState();
}

class _ProviderRequestsPageState extends State<ProviderRequestsPage> {
  late final ChatRepository _chatRepository =
      widget._chatRepository ?? locator<ChatRepository>();
  late final ProviderRequestsViewModel _viewModel = ProviderRequestsViewModel(
    widget._repository ?? locator<OrdersRepository>(),
    reviewsRepository: widget._reviewsRepository ?? locator<ReviewsRepository>(),
  );

  late ProviderRequestsTab _tab = widget.initialTab;
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

  Future<void> _runAction(
    ProviderRequestDisplay request,
    String action,
    Future<void> Function() run, {
    required String successMessage,
  }) async {
    setState(() {
      _busyOrderId = request.order.id.value;
      _busyAction = action;
    });
    try {
      await run();
      if (!mounted) return;
      AppSnackBar.show(context, successMessage, type: AppSnackBarType.success);
    } on HttpException catch (exception) {
      if (!mounted) return;
      AppSnackBar.show(context, exception.message, type: AppSnackBarType.error);
    } finally {
      if (mounted) setState(() => _busyOrderId = null);
    }
  }

  Future<void> _submitQuote(ProviderRequestDisplay request) async {
    final result = await SubmitQuoteSheet.show(context);
    if (result == null || !mounted) return;
    await _runAction(
      request,
      'quote',
      () => _viewModel.submitQuote(
        request,
        proposedPrice: result.proposedPrice,
        estimatedDuration: result.estimatedDuration,
        notes: result.notes,
      ),
      successMessage: 'Enviaste tu cotización a ${request.clientName}.',
    );
  }

  Future<void> _start(ProviderRequestDisplay request) => _runAction(
    request,
    'start',
    () => _viewModel.start(request),
    successMessage: 'Comenzaste el servicio de ${request.clientName}.',
  );

  Future<void> _complete(ProviderRequestDisplay request) async {
    final confirmed = await AppDialog.show<bool>(
      context,
      title: 'Marcar como finalizado',
      content: Text(
        '¿Confirmas que terminaste el servicio de ${request.clientName}? '
        'El cliente podrá calificarlo después de esto.',
      ),
      actions: [
        AppButton(
          label: 'Cancelar',
          variant: AppButtonVariant.text,
          expand: false,
          onPressed: () => Navigator.of(context).pop(false),
        ),
        AppButton(
          label: 'Finalizar',
          expand: false,
          onPressed: () => Navigator.of(context).pop(true),
        ),
      ],
    );
    if (confirmed != true || !mounted) return;
    await _runAction(
      request,
      'complete',
      () => _viewModel.complete(request),
      successMessage: 'Marcaste como finalizado el servicio de ${request.clientName}.',
    );
  }

  Future<void> _reject(ProviderRequestDisplay request) => _runAction(
    request,
    'reject',
    () => _viewModel.reject(request),
    successMessage: 'Rechazaste la solicitud de ${request.clientName}.',
  );

  Future<void> _openChat(ProviderRequestDisplay request) async {
    final providerId = request.order.providerId;
    if (providerId == null) return;
    try {
      await _chatRepository.createOrGetForOrder(request.order, providerId);
      if (!mounted) return;
      Navigator.of(context).push(
        MaterialPageRoute<void>(
          builder: (context) => Scaffold(
            appBar: AppBar(title: const Text('Conversación')),
            body: const SafeArea(child: ChatPage()),
          ),
        ),
      );
    } on HttpException catch (exception) {
      if (!mounted) return;
      AppSnackBar.show(context, exception.message, type: AppSnackBarType.error);
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
        final requests = _tab == ProviderRequestsTab.active
            ? _viewModel.activeRequests
            : _viewModel.historyRequests;
        return requests.isEmpty
            ? ProviderRequestsEmptyState(tab: _tab)
            : ProviderRequestsList(
                requests: requests,
                busyOrderId: _busyOrderId,
                busyAction: _busyAction,
                onSubmitQuote: _submitQuote,
                onStart: _start,
                onComplete: _complete,
                onReject: _reject,
                onOpenChat: _openChat,
              );
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppPageBody(
      header: ProviderRequestsHeader(
        selectedTab: _tab,
        onTabChanged: (tab) => setState(() => _tab = tab),
      ),
      body: _buildBody(),
    );
  }
}
