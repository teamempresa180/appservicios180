import 'package:flutter/material.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/ui/animations/scale_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';
import '../../../../core/ui/widgets/app_loading.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../../models/provider_profile_data.dart';
import '../../repositories/provider_profile_repository.dart';
import '../view_models/provider_profile_view_model.dart';
import '../widgets/provider_actions.dart';
import '../widgets/provider_availability.dart';
import '../widgets/provider_information.dart';
import '../widgets/provider_profile_header.dart';
import '../widgets/provider_reviews_summary.dart';
import '../widgets/provider_services.dart';
import '../widgets/provider_specialties.dart';
import '../widgets/provider_statistics.dart';

/// Provider Profile screen. Does NOT build its own `Scaffold` — it is
/// meant to be inserted into the existing navigation flow later, the
/// same way every other feature so far does. Completely independent:
/// its own repository, its own mock data.
///
/// Shows a single, fixed provider (no id-based lookup yet) — see the
/// feature README. Data is loaded from the real backend via
/// [ProviderProfileViewModel] (resolved from the service locator when
/// no [repository] override is supplied — see
/// `core/di/service_locator.dart`).
class ProviderProfilePage extends StatefulWidget {
  const ProviderProfilePage({super.key, ProviderProfileRepository? repository})
    : _repository = repository;

  /// Overridable for tests only — production call sites always resolve
  /// the real repository from the service locator.
  final ProviderProfileRepository? _repository;

  @override
  State<ProviderProfilePage> createState() => _ProviderProfilePageState();
}

class _ProviderProfilePageState extends State<ProviderProfilePage> {
  late final ProviderProfileViewModel _viewModel = ProviderProfileViewModel(
    widget._repository ?? locator<ProviderProfileRepository>(),
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

  @override
  Widget build(BuildContext context) {
    return switch (_viewModel.status) {
      ProviderProfileLoadStatus.loading => const AppPageBody(
        body: AppLoading(message: 'Cargando perfil del proveedor...'),
      ),
      ProviderProfileLoadStatus.error => AppPageBody(
        body: AppEmptyState(
          icon: AppIcons.error,
          title: 'No se pudo cargar el perfil del proveedor',
          description: _viewModel.errorMessage,
          actionLabel: 'Reintentar',
          onActionPressed: _viewModel.retry,
        ),
      ),
      ProviderProfileLoadStatus.success => _buildContent(_viewModel.data!),
    };
  }

  Widget _buildContent(ProviderProfileData data) {
    return AppPageBody(
      header: ProviderProfileHeader(data: data),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          SlideIn(child: ProviderInformation(data: data)),
          const SizedBox(height: AppSpacing.space16),
          ScaleIn(child: ProviderStatistics(data: data)),
          const SizedBox(height: AppSpacing.space16),
          SlideIn(child: ProviderSpecialties(specialties: data.specialties)),
          const SizedBox(height: AppSpacing.space16),
          SlideIn(child: ProviderServices(services: data.services)),
          const SizedBox(height: AppSpacing.space16),
          SlideIn(child: ProviderAvailability(availability: data.availability)),
          const SizedBox(height: AppSpacing.space16),
          SlideIn(child: ProviderReviewsSummary(data: data)),
          const SizedBox(height: AppSpacing.space16),
          const ProviderActions(),
        ],
      ),
    );
  }
}
