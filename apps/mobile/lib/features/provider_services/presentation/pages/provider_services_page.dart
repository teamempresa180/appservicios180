import 'package:flutter/material.dart';
import '../../../../core/ui/animations/fade_in.dart';
import '../../../../core/ui/animations/scale_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../mock/mock_provider_services_data.dart';
import '../../models/provider_service_display.dart';
import '../../repositories/mock_provider_services_repository.dart';
import '../widgets/add_service_button.dart';
import '../widgets/services_empty_state.dart';
import '../widgets/services_header.dart';
import '../widgets/services_list.dart';
import '../widgets/services_loading.dart';
import '../widgets/services_statistics.dart';

/// The three purely-visual states this screen can render — same
/// fixed-`state` approach as every list/detail feature since `search`.
enum ProviderServicesViewState { loading, empty, information }

/// Provider Services screen. Does NOT build its own `Scaffold` — it is
/// meant to live within the existing navigation flow (opened from
/// `Provider Dashboard`). Completely independent: its own repository,
/// its own mock data.
///
/// Shows a fixed list of services (no id-based lookup yet) — see the
/// feature README.
class ProviderServicesPage extends StatelessWidget {
  const ProviderServicesPage({
    super.key,
    this.state = ProviderServicesViewState.information,
  });

  final ProviderServicesViewState state;

  List<ProviderServiceDisplay> _buildServices() {
    final repository = MockProviderServicesRepository();
    final provider = repository.getProvider();
    final profile = repository.getProfile();

    return [
      for (final service in repository.getServices())
        ProviderServiceDisplay(
          provider: provider,
          profile: profile,
          service: service,
          category: repository.getCategoryFor(service),
          viewsCount: mockServiceViewsCount[service.id]!,
          requestsCount: mockServiceRequestsCount[service.id]!,
          featured: mockServiceFeatured[service.id]!,
          lastUpdatedLabel: mockServiceLastUpdatedLabel[service.id]!,
        ),
    ];
  }

  Widget _buildBody() {
    switch (state) {
      case ProviderServicesViewState.loading:
        return const ServicesLoading();
      case ProviderServicesViewState.empty:
        return const ServicesEmptyState();
      case ProviderServicesViewState.information:
        final services = _buildServices();
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            ScaleIn(child: ServicesStatistics(services: services)),
            const SizedBox(height: AppSpacing.space16),
            const AddServiceButton(),
            const SizedBox(height: AppSpacing.space16),
            SlideIn(child: ServicesList(services: services)),
          ],
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const FadeIn(child: ServicesHeader()),
          const SizedBox(height: AppSpacing.space16),
          _buildBody(),
        ],
      ),
    );
  }
}
