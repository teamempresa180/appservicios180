import 'package:flutter/material.dart';
import '../../../../category/entities/category.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
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

  static final _categoryRepository = MockCategoryRepository();
  static final _serviceRepository = MockServiceRepository();
  static final _providerRepository = MockProviderRepository();

  /// Composes each display list from its repository — same
  /// `_build*()` naming/placement convention every other data-driven
  /// feature's page uses (see the feature README). Three separate
  /// `_build*()` methods (not one `_buildData()`) because this feature
  /// composes three independent repositories, unlike every other
  /// feature's single composed `*Display`.
  List<Category> _buildCategories() => _categoryRepository.getAll();

  List<ServiceDisplay> _buildServices() {
    return [
      for (final service in _serviceRepository.getFeatured())
        ServiceDisplay(
          service: service,
          providerName: _providerRepository
              .profileOf(service.providerId)
              .displayName,
          categoryName:
              _categoryRepository.getById(service.categoryId)?.name ?? '',
          rating: _serviceRepository.ratingOf(service.id),
        ),
    ];
  }

  List<ProviderDisplay> _buildProviders() {
    return [
      for (final provider in _providerRepository.getRecommended())
        ProviderDisplay(
          provider: provider,
          profile: _providerRepository.profileOf(provider.id),
          rating: _providerRepository.ratingOf(provider.id),
          servicesCount: _providerRepository.servicesCountOf(provider.id),
        ),
    ];
  }

  @override
  Widget build(BuildContext context) {
    final categories = _buildCategories();
    final serviceDisplays = _buildServices();
    final providerDisplays = _buildProviders();

    return AppPageBody(
      header: const MarketplaceHeader(),
      toolbar: const [MarketplaceSearchBar()],
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
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
