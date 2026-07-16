import 'package:flutter/material.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';
import '../../../../core/ui/widgets/app_loading.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../../repositories/category_repository.dart';
import '../../repositories/provider_repository.dart';
import '../../repositories/service_repository.dart';
import '../view_models/marketplace_view_model.dart';
import '../widgets/categories_section.dart';
import '../widgets/featured_services.dart';
import '../widgets/marketplace_header.dart';
import '../widgets/recommended_providers.dart';
import '../widgets/search_bar.dart';

/// Marketplace screen. Lives inside the App Shell's body (the "Buscar"
/// destination) — it does NOT build its own `Scaffold`, it only returns
/// content for the area the Shell already provides.
///
/// Composes three independent repositories (Category/Service/Provider)
/// into a single [MarketplaceViewModel] with one combined
/// loading/success/error state — same reasoning as every other
/// data-driven feature's single view model, just fed by three
/// repositories instead of one (see the feature README). All three
/// default to resolving from the service locator; each can be
/// overridden independently for tests.
class MarketplacePage extends StatefulWidget {
  const MarketplacePage({
    super.key,
    CategoryRepository? categoryRepository,
    ServiceRepository? serviceRepository,
    ProviderRepository? providerRepository,
  }) : _categoryRepository = categoryRepository,
       _serviceRepository = serviceRepository,
       _providerRepository = providerRepository;

  /// Overridable for tests only — production call sites always resolve
  /// the real repositories from the service locator.
  final CategoryRepository? _categoryRepository;
  final ServiceRepository? _serviceRepository;
  final ProviderRepository? _providerRepository;

  @override
  State<MarketplacePage> createState() => _MarketplacePageState();
}

class _MarketplacePageState extends State<MarketplacePage> {
  late final MarketplaceViewModel _viewModel = MarketplaceViewModel(
    categoryRepository:
        widget._categoryRepository ?? locator<CategoryRepository>(),
    serviceRepository:
        widget._serviceRepository ?? locator<ServiceRepository>(),
    providerRepository:
        widget._providerRepository ?? locator<ProviderRepository>(),
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
      case MarketplaceLoadStatus.loading:
        return const AppLoading(message: 'Cargando marketplace...');
      case MarketplaceLoadStatus.error:
        return AppEmptyState(
          icon: AppIcons.error,
          title: 'No se pudo cargar el marketplace',
          description: _viewModel.errorMessage,
          actionLabel: 'Reintentar',
          onActionPressed: _viewModel.retry,
        );
      case MarketplaceLoadStatus.success:
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            SlideIn(child: CategoriesSection(categories: _viewModel.categories)),
            const SizedBox(height: AppSpacing.space16),
            SlideIn(child: FeaturedServices(services: _viewModel.services)),
            const SizedBox(height: AppSpacing.space16),
            SlideIn(
              child: RecommendedProviders(providers: _viewModel.providers),
            ),
          ],
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppPageBody(
      header: const MarketplaceHeader(),
      toolbar: const [MarketplaceSearchBar()],
      body: _buildBody(),
    );
  }
}
