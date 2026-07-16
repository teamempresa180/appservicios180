import 'package:flutter/material.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/ui/animations/scale_in.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';
import '../../../../core/ui/widgets/app_loading.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../../repositories/provider_services_repository.dart';
import '../view_models/provider_services_view_model.dart';
import '../widgets/add_service_button.dart';
import '../widgets/services_empty_state.dart';
import '../widgets/services_header.dart';
import '../widgets/services_list.dart';
import '../widgets/services_statistics.dart';

/// Provider Services screen. Does NOT build its own `Scaffold` — it is
/// meant to live within the existing navigation flow (opened from
/// `Provider Dashboard`). Loads from the real backend via
/// [ProviderServicesViewModel] (resolved from the service locator —
/// see `core/di/service_locator.dart`). Completely independent of
/// every other feature: its own repository, its own view model.
///
/// Shows a fixed provider's services (no id-based lookup yet) — see
/// the feature README.
class ProviderServicesPage extends StatefulWidget {
  const ProviderServicesPage({
    super.key,
    ProviderServicesRepository? repository,
  }) : _repository = repository;

  /// Overridable for tests only — production call sites always resolve
  /// the real repository from the service locator.
  final ProviderServicesRepository? _repository;

  @override
  State<ProviderServicesPage> createState() => _ProviderServicesPageState();
}

class _ProviderServicesPageState extends State<ProviderServicesPage> {
  late final ProviderServicesViewModel _viewModel = ProviderServicesViewModel(
    widget._repository ?? locator<ProviderServicesRepository>(),
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
      case ProviderServicesLoadStatus.loading:
        return const AppLoading(message: 'Cargando servicios...');
      case ProviderServicesLoadStatus.error:
        return AppEmptyState(
          icon: AppIcons.error,
          title: 'No se pudieron cargar los servicios',
          description: _viewModel.errorMessage,
          actionLabel: 'Reintentar',
          onActionPressed: _viewModel.retry,
        );
      case ProviderServicesLoadStatus.success:
        final services = _viewModel.services;
        if (services.isEmpty) {
          return const ServicesEmptyState();
        }
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            ScaleIn(child: ServicesStatistics(services: services)),
            const SizedBox(height: AppSpacing.space16),
            const AddServiceButton(),
            const SizedBox(height: AppSpacing.space16),
            ServicesList(services: services),
          ],
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppPageBody(header: const ServicesHeader(), body: _buildBody());
  }
}
