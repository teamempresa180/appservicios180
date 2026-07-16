import 'package:flutter/material.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/ui/animations/scale_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';
import '../../../../core/ui/widgets/app_loading.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../../availability/presentation/pages/availability_page.dart';
import '../../../provider_services/presentation/pages/provider_services_page.dart';
import '../../../schedule/presentation/pages/schedule_page.dart';
import '../../models/provider_dashboard_display.dart';
import '../../repositories/provider_dashboard_repository.dart';
import '../view_models/provider_dashboard_view_model.dart';
import '../widgets/dashboard_header.dart';
import '../widgets/dashboard_statistics.dart';
import '../widgets/earnings_summary.dart';
import '../widgets/pending_requests.dart';
import '../widgets/provider_performance.dart';
import '../widgets/quick_actions.dart';
import '../widgets/recent_orders.dart';

/// Provider Dashboard screen. Does NOT build its own `Scaffold` — it
/// is meant to live within the existing navigation flow (opened from
/// `Profile`). Completely independent: its own repository, its own
/// view model.
///
/// Shows a single, fixed provider's dashboard (no id-based lookup yet)
/// — see the feature README. Loaded from the real backend via
/// [ProviderDashboardViewModel] (resolved from the service locator —
/// see `core/di/service_locator.dart`).
class ProviderDashboardPage extends StatefulWidget {
  const ProviderDashboardPage({super.key, ProviderDashboardRepository? repository})
    : _repository = repository;

  /// Overridable for tests only — production call sites always resolve
  /// the real repository from the service locator.
  final ProviderDashboardRepository? _repository;

  @override
  State<ProviderDashboardPage> createState() => _ProviderDashboardPageState();
}

class _ProviderDashboardPageState extends State<ProviderDashboardPage> {
  late final ProviderDashboardViewModel _viewModel = ProviderDashboardViewModel(
    widget._repository ?? locator<ProviderDashboardRepository>(),
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

  Widget _buildBody(BuildContext context, ProviderDashboardDisplay data) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        ScaleIn(child: EarningsSummary(data: data)),
        const SizedBox(height: AppSpacing.space16),
        SlideIn(child: DashboardStatistics(data: data)),
        const SizedBox(height: AppSpacing.space16),
        SlideIn(child: ProviderPerformance(data: data)),
        const SizedBox(height: AppSpacing.space16),
        SlideIn(child: RecentOrders(data: data)),
        const SizedBox(height: AppSpacing.space16),
        SlideIn(child: PendingRequests(data: data)),
        const SizedBox(height: AppSpacing.space16),
        QuickActions(
          onViewServices: () => _openProviderServices(context),
          onAvailability: () => _openAvailability(context),
          onSchedule: () => _openSchedule(context),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final data = _viewModel.data;

    return AppPageBody(
      header: data == null
          ? const AppSectionTitle(title: 'Panel del proveedor')
          : DashboardHeader(data: data),
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
        ProviderDashboardLoadStatus.success => _buildBody(context, data!),
      },
    );
  }
}
