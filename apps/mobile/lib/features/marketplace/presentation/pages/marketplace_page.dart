import 'package:flutter/material.dart';
import '../../../../core/ui/animations/fade_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../models/provider_display.dart';
import '../../models/service_display.dart';
import '../../repositories/mock_category_repository.dart';
import '../../repositories/mock_provider_repository.dart';
import '../../repositories/mock_service_repository.dart';
import '../widgets/categories_section.dart';
import '../widgets/featured_services.dart';
import '../widgets/marketplace_header.dart';
import '../widgets/recommended_providers.dart';
import '../widgets/search_bar.dart';

/// Marketplace screen. Lives inside the App Shell's body (the "Buscar"
/// destination) — it does NOT build its own `Scaffold`, it only returns
/// content for the area the Shell already provides.
///
/// All data comes from the Mock repositories in `../../repositories/` —
/// no backend, no API, no Firebase. See the feature README for how this
/// connects to real data later.
class MarketplacePage extends StatelessWidget {
  const MarketplacePage({super.key});

  @override
  Widget build(BuildContext context) {
    final categoryRepository = MockCategoryRepository();
    final serviceRepository = MockServiceRepository();
    final providerRepository = MockProviderRepository();

    final categories = categoryRepository.getAll();
    final services = serviceRepository.getFeatured();
    final providers = providerRepository.getRecommended();

    final serviceDisplays = [
      for (final service in services)
        ServiceDisplay(
          service: service,
          providerName: providerRepository
              .profileOf(service.providerId)
              .displayName,
          categoryName: categoryRepository.getById(service.categoryId)?.name ?? '',
          rating: serviceRepository.ratingOf(service.id),
        ),
    ];

    final providerDisplays = [
      for (final provider in providers)
        ProviderDisplay(
          provider: provider,
          profile: providerRepository.profileOf(provider.id),
          rating: providerRepository.ratingOf(provider.id),
          servicesCount: providerRepository.servicesCountOf(provider.id),
        ),
    ];

    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const FadeIn(child: MarketplaceHeader()),
          const SizedBox(height: AppSpacing.space16),
          const MarketplaceSearchBar(),
          const SizedBox(height: AppSpacing.space16),
          SlideIn(child: CategoriesSection(categories: categories)),
          const SizedBox(height: AppSpacing.space16),
          SlideIn(child: FeaturedServices(services: serviceDisplays)),
          const SizedBox(height: AppSpacing.space16),
          SlideIn(child: RecommendedProviders(providers: providerDisplays)),
        ],
      ),
    );
  }
}
