import 'package:collection/collection.dart';
import 'package:flutter/material.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/navigation_external/external_navigation_launcher.dart';
import '../../../../core/network/http_exceptions.dart';
import '../../../../core/ui/animations/scale_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../../../core/ui/widgets/app_dialog.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';
import '../../../../core/ui/widgets/app_loading.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../../../core/ui/widgets/app_snack_bar.dart';
import '../../../../order/entities/order.dart';
import '../../../../order/journey/provider_order_journey.dart';
import '../../../address_management/repositories/address_management_repository.dart';
import '../../../availability/presentation/pages/availability_page.dart';
import '../../../chat/presentation/pages/chat_page.dart';
import '../../../chat/repositories/chat_repository.dart';
import '../../../orders/presentation/pages/provider_requests_page.dart';
import '../../../orders/presentation/widgets/provider_requests_header.dart';
import '../../../orders/repositories/orders_repository.dart';
import '../../../../provider/models/provider_status.dart';
import '../../../provider_services/presentation/pages/provider_services_page.dart';
import '../../../schedule/presentation/pages/schedule_page.dart';
import '../../../settings/presentation/pages/settings_page.dart';
import '../../models/provider_dashboard_display.dart';
import '../../repositories/provider_dashboard_repository.dart';
import '../view_models/provider_dashboard_view_model.dart';
import '../widgets/active_service_card.dart';
import '../widgets/dashboard_header.dart';
import '../widgets/dashboard_statistics.dart';
import '../widgets/earnings_summary.dart';
import '../widgets/pending_quotes.dart';
import '../widgets/pending_requests.dart';
import '../widgets/provider_performance.dart';
import '../widgets/quick_actions.dart';
import '../widgets/recent_orders.dart';
import '../widgets/scheduled_services.dart';

/// Provider Dashboard screen. Does NOT build its own `Scaffold` — it
/// is meant to live within the existing navigation flow (opened from
/// `Profile`). Completely independent: its own repository, its own
/// view model.
///
/// Reorganized around one explicit priority order — "what does this
/// provider need to do right now" — rather than a flat list of
/// equal-weight sections: the order actively being worked
/// ([ActiveServiceCard], picked by `ProviderDashboardDisplay
/// .activeOrder`) comes first and most prominent, then scheduled work,
/// then new requests to quote, then quotes awaiting a client decision,
/// then general performance/earnings info, then a low-key history
/// link — see each widget's own doc comment for why it sits where it
/// does.
///
/// Shows a single, fixed provider's dashboard (no id-based lookup yet)
/// — see the feature README. Loaded from the real backend via
/// [ProviderDashboardViewModel] (resolved from the service locator —
/// see `core/di/service_locator.dart`). [OrdersRepository]/
/// [ChatRepository] back the active-service card's actions (start/
/// complete/chat) — [ProviderDashboardRepository] itself is read-only.
class ProviderDashboardPage extends StatefulWidget {
  const ProviderDashboardPage({
    super.key,
    ProviderDashboardRepository? repository,
    OrdersRepository? ordersRepository,
    ChatRepository? chatRepository,
    AddressManagementRepository? addressManagementRepository,
  }) : _repository = repository,
       _ordersRepository = ordersRepository,
       _chatRepository = chatRepository,
       _addressManagementRepository = addressManagementRepository;

  /// Overridable for tests only — production call sites always resolve
  /// the real repositories from the service locator.
  final ProviderDashboardRepository? _repository;
  final OrdersRepository? _ordersRepository;
  final ChatRepository? _chatRepository;
  final AddressManagementRepository? _addressManagementRepository;

  @override
  State<ProviderDashboardPage> createState() => _ProviderDashboardPageState();
}

class _ProviderDashboardPageState extends State<ProviderDashboardPage> {
  late final ProviderDashboardViewModel _viewModel = ProviderDashboardViewModel(
    widget._repository ?? locator<ProviderDashboardRepository>(),
  );
  late final OrdersRepository _ordersRepository =
      widget._ordersRepository ?? locator<OrdersRepository>();
  late final ChatRepository _chatRepository =
      widget._chatRepository ?? locator<ChatRepository>();
  late final AddressManagementRepository _addressManagementRepository =
      widget._addressManagementRepository ??
      locator<AddressManagementRepository>();

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

  void _openProviderServices(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (context) => Scaffold(
          appBar: AppBar(title: const Text('Mis servicios')),
          body: const SafeArea(child: ProviderServicesPage()),
        ),
      ),
    );
  }

  void _openAvailability(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (context) => Scaffold(
          appBar: AppBar(title: const Text('Disponibilidad')),
          body: const SafeArea(child: AvailabilityPage()),
        ),
      ),
    );
  }

  void _openSchedule(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (context) => Scaffold(
          appBar: AppBar(title: const Text('Agenda')),
          body: const SafeArea(child: SchedulePage()),
        ),
      ),
    );
  }

  void _openSettings(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (context) => Scaffold(
          appBar: AppBar(title: const Text('Configuración')),
          body: const SafeArea(child: SettingsPage()),
        ),
      ),
    );
  }

  /// Opens the provider's "Servicios" screen (every relevant Order,
  /// with its own guided journey per order) — reused as the
  /// destination for every "ver más"-style link on this dashboard
  /// instead of duplicating any of that list here.
  void _openProviderRequests(
    BuildContext context, {
    ProviderRequestsTab tab = ProviderRequestsTab.active,
  }) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (context) => Scaffold(
          appBar: AppBar(title: const Text('Servicios')),
          body: SafeArea(child: ProviderRequestsPage(initialTab: tab)),
        ),
      ),
    );
  }

  /// Which active-service action is in flight (`'start'`/`'complete'`)
  /// — drives [ActiveServiceCard]'s spinner so the card doesn't sit
  /// inert between the tap and the success snackbar.
  String? _busyAction;

  Future<void> _startOrder(Order order) async {
    setState(() => _busyAction = 'start');
    try {
      await _ordersRepository.startOrder(order);
      if (!mounted) return;
      AppSnackBar.show(
        context,
        'Comenzaste el servicio.',
        type: AppSnackBarType.success,
      );
      await _viewModel.refresh();
    } on HttpException catch (exception) {
      if (!mounted) return;
      AppSnackBar.show(context, exception.message, type: AppSnackBarType.error);
    } catch (_) {
      if (!mounted) return;
      AppSnackBar.show(
        context,
        'No se pudo completar la acción. Intenta de nuevo.',
        type: AppSnackBarType.error,
      );
    } finally {
      if (mounted) setState(() => _busyAction = null);
    }
  }

  Future<void> _completeOrder(Order order) async {
    final confirmed = await AppDialog.show<bool>(
      context,
      title: 'Marcar como finalizado',
      content: const Text(
        '¿Confirmas que terminaste este servicio? El cliente podrá '
        'calificarlo después de esto.',
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
    setState(() => _busyAction = 'complete');
    try {
      await _ordersRepository.completeOrder(order);
      if (!mounted) return;
      AppSnackBar.show(
        context,
        'Marcaste el servicio como finalizado.',
        type: AppSnackBarType.success,
      );
      await _viewModel.refresh();
    } on HttpException catch (exception) {
      if (!mounted) return;
      AppSnackBar.show(context, exception.message, type: AppSnackBarType.error);
    } catch (_) {
      if (!mounted) return;
      AppSnackBar.show(
        context,
        'No se pudo completar la acción. Intenta de nuevo.',
        type: AppSnackBarType.error,
      );
    } finally {
      if (mounted) setState(() => _busyAction = null);
    }
  }

  Future<void> _openChat(Order order) async {
    final providerId = order.providerId;
    if (providerId == null) return;
    try {
      await _chatRepository.createOrGetForOrder(order, providerId);
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
    } catch (_) {
      if (!mounted) return;
      AppSnackBar.show(
        context,
        'No se pudo abrir la conversación. Intenta de nuevo.',
        type: AppSnackBarType.error,
      );
    }
  }

  /// Resolves [order]'s `addressId` to a real `Address` (the backend
  /// has no `GET /addresses/:id`, so this lists every address for the
  /// current session and matches client-side — same shape already used
  /// by `getClientProfileFor`/`getCurrentProvider` elsewhere in this
  /// codebase) and hands the assembled address text off to
  /// [ExternalNavigationLauncher]. Any failure — no addresses at all,
  /// no match for this id, or a `HttpException` from the fetch itself
  /// — surfaces as an `AppSnackBar` instead of crashing the dashboard.
  Future<void> _startNavigation(Order order) async {
    final addressId = order.addressId;
    if (addressId == null) return;
    try {
      final addresses = await _addressManagementRepository.getAddresses();
      final address = addresses.where((a) => a.id == addressId).firstOrNull;
      if (address == null) {
        throw StateError('No se encontró la dirección de este servicio.');
      }
      if (!mounted) return;
      await ExternalNavigationLauncher.start(
        context,
        destinationAddress:
            '${address.fullAddress}, ${address.city}, ${address.state}, '
            '${address.country}',
      );
    } on HttpException catch (exception) {
      if (!mounted) return;
      AppSnackBar.show(context, exception.message, type: AppSnackBarType.error);
    } catch (_) {
      if (!mounted) return;
      AppSnackBar.show(
        context,
        'No se pudo iniciar la navegación. Intenta de nuevo.',
        type: AppSnackBarType.error,
      );
    }
  }

  Widget _buildBody(BuildContext context, ProviderDashboardDisplay data) {
    final activeOrder = data.activeOrder;
    final otherActiveCount = data.otherActiveOrders.length;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        if (activeOrder != null) ...[
          ScaleIn(
            child: ActiveServiceCard(
              order: activeOrder,
              journey: ProviderOrderJourney.derive(
                order: activeOrder,
                myQuote: data.myQuoteFor(activeOrder),
                hasReviewed: data.hasReviewFor(activeOrder),
              ),
              otherActiveCount: otherActiveCount,
              onStart: () => _startOrder(activeOrder),
              onComplete: () => _completeOrder(activeOrder),
              onOpenChat: () => _openChat(activeOrder),
              onViewOthers: () => _openProviderRequests(context),
              onNavigate: () => _startNavigation(activeOrder),
              busyAction: _busyAction,
            ),
          ),
          const SizedBox(height: AppSpacing.space16),
        ],
        SlideIn(child: ScheduledServices(data: data)),
        const SizedBox(height: AppSpacing.space16),
        SlideIn(
          child: PendingRequests(
            data: data,
            onViewAll: () => _openProviderRequests(context),
          ),
        ),
        const SizedBox(height: AppSpacing.space16),
        SlideIn(child: PendingQuotes(data: data)),
        const SizedBox(height: AppSpacing.space16),
        SlideIn(child: EarningsSummary(data: data)),
        const SizedBox(height: AppSpacing.space16),
        SlideIn(child: DashboardStatistics(data: data)),
        const SizedBox(height: AppSpacing.space16),
        SlideIn(child: ProviderPerformance(data: data)),
        const SizedBox(height: AppSpacing.space16),
        RecentOrders(
          data: data,
          onViewHistory: () =>
              _openProviderRequests(context, tab: ProviderRequestsTab.history),
        ),
        const SizedBox(height: AppSpacing.space16),
        QuickActions(
          onViewServices: () => _openProviderServices(context),
          onAvailability: () => _openAvailability(context),
          onSchedule: () => _openSchedule(context),
          onSettings: () => _openSettings(context),
        ),
      ],
    );
  }

  /// A provider whose account isn't [ProviderStatus.active] yet has
  /// nothing real to manage — showing the full dashboard (start/
  /// complete-service actions, quote lists, earnings) to a Pendiente/
  /// En revisión/Rechazado/Suspendido/Bloqueado account is a dead end:
  /// every action would fail against the backend, since only an Active
  /// Provider record grants the Provider role and its endpoints (see
  /// backend `login.use-case.ts`). Shown instead of [_buildBody] for
  /// every non-Active status.
  Widget _buildStatusGate(BuildContext context, ProviderStatus status) {
    final (title, description) = switch (status) {
      ProviderStatus.pending => (
        'Solicitud enviada',
        'Tu solicitud para ser proveedor fue recibida. Te avisaremos '
            'apenas empiece la revisión.',
      ),
      ProviderStatus.inReview => (
        'Tu cuenta está en revisión',
        'Estamos revisando tus documentos de verificación. Esto puede '
            'tomar un tiempo — te avisaremos en cuanto termine.',
      ),
      ProviderStatus.rejected => (
        'Solicitud rechazada',
        'Tu solicitud para ser proveedor no fue aprobada. Contacta a '
            'soporte para más información.',
      ),
      ProviderStatus.suspended => (
        'Cuenta suspendida',
        'Tu cuenta de proveedor está suspendida temporalmente. '
            'Contacta a soporte para más información.',
      ),
      ProviderStatus.blocked => (
        'Cuenta bloqueada',
        'Tu cuenta de proveedor fue bloqueada. Contacta a soporte para '
            'más información.',
      ),
      ProviderStatus.inactive || ProviderStatus.archived => (
        'Cuenta de proveedor inactiva',
        'Tu cuenta de proveedor no está activa en este momento.',
      ),
      ProviderStatus.active => (
        'Panel del proveedor',
        null,
      ),
    };
    return AppEmptyState(
      icon: AppIcons.info,
      title: title,
      description: description,
    );
  }

  @override
  Widget build(BuildContext context) {
    final data = _viewModel.data;
    final isActiveProvider =
        _viewModel.status != ProviderDashboardLoadStatus.success ||
        data!.provider.status == ProviderStatus.active;

    return AppPageBody(
      header: data == null
          ? const AppSectionTitle(title: 'Panel del proveedor')
          : isActiveProvider
          ? DashboardHeader(data: data)
          : const AppSectionTitle(title: 'Panel del proveedor'),
      body: switch (_viewModel.status) {
        ProviderDashboardLoadStatus.loading => const AppLoading(
          message: 'Cargando panel...',
        ),
        ProviderDashboardLoadStatus.error => AppEmptyState(
          icon: AppIcons.error,
          title: 'No se pudo cargar el panel',
          description: _viewModel.errorMessage,
          actionLabel: 'Reintentar',
          onActionPressed: _viewModel.retry,
        ),
        ProviderDashboardLoadStatus.success => data!.provider.status ==
                ProviderStatus.active
            ? _buildBody(context, data)
            : _buildStatusGate(context, data.provider.status),
      },
    );
  }
}
