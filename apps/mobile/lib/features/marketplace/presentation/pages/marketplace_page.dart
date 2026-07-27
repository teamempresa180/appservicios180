import 'package:collection/collection.dart';
import 'package:flutter/material.dart';
import '../../../../category/entities/category.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';
import '../../../../core/ui/widgets/app_loading.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../../../app_shell/navigation_intent.dart';
import '../../../search/models/search_result.dart';
import '../../../search/presentation/view_models/search_view_model.dart';
import '../../../search/presentation/widgets/search_empty_state.dart';
import '../../../search/presentation/widgets/search_results.dart';
import '../../../search/repositories/search_repository.dart';
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
/// Merges what used to be two separate, disconnected screens: the
/// browse view below (categories/featured/recommended, backed by
/// [MarketplaceViewModel]) and the free-text/category search results
/// (backed by [SearchViewModel], previously stranded in an unreachable
/// `SearchPage`). Typing in the search bar or tapping a category
/// switches from the browse view to a filtered results list — see
/// [_isFiltering].
class MarketplacePage extends StatefulWidget {
  const MarketplacePage({
    super.key,
    CategoryRepository? categoryRepository,
    ServiceRepository? serviceRepository,
    ProviderRepository? providerRepository,
    SearchRepository? searchRepository,
  }) : _categoryRepository = categoryRepository,
       _serviceRepository = serviceRepository,
       _providerRepository = providerRepository,
       _searchRepository = searchRepository;

  /// Overridable for tests only — production call sites always resolve
  /// the real repositories from the service locator.
  final CategoryRepository? _categoryRepository;
  final ServiceRepository? _serviceRepository;
  final ProviderRepository? _providerRepository;
  final SearchRepository? _searchRepository;

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

  late final SearchViewModel _searchViewModel = SearchViewModel(
    widget._searchRepository ?? locator<SearchRepository>(),
  );

  final TextEditingController _queryController = TextEditingController();
  String _query = '';
  Category? _selectedCategory;

  /// Set by [_onNavigationIntent] when Home's quick-category cards ask
  /// to land here pre-filtered — consumed once [_viewModel] has
  /// actually loaded the real categories to match against by name.
  String? _pendingCategoryName;

  bool get _isFiltering => _query.isNotEmpty || _selectedCategory != null;

  @override
  void initState() {
    super.initState();
    _viewModel.load();
    _viewModel.addListener(_onViewModelChanged);
    _searchViewModel.load();
    _searchViewModel.addListener(_onViewModelChanged);
    locator<AppShellNavigationIntent>().addListener(_onNavigationIntent);
  }

  void _onViewModelChanged() {
    setState(() {});
    _applyPendingCategoryIfReady();
  }

  void _onNavigationIntent() {
    final categoryName = locator<AppShellNavigationIntent>()
        .pendingCategoryName;
    if (categoryName == null) return;
    locator<AppShellNavigationIntent>().consumeCategoryName();
    _pendingCategoryName = categoryName;
    _applyPendingCategoryIfReady();
  }

  void _applyPendingCategoryIfReady() {
    final pendingName = _pendingCategoryName;
    if (pendingName == null) return;
    if (_viewModel.status != MarketplaceLoadStatus.success) return;
    final match = _viewModel.categories
        .where((c) => c.name.toLowerCase() == pendingName.toLowerCase())
        .firstOrNull;
    _pendingCategoryName = null;
    if (match == null) return;
    setState(() {
      _query = '';
      _queryController.clear();
      _selectedCategory = match;
    });
  }

  void _onQueryChanged(String value) => setState(() => _query = value);

  void _onCategoryTap(Category category) {
    setState(() {
      _selectedCategory = _selectedCategory?.id == category.id
          ? null
          : category;
    });
  }

  @override
  void dispose() {
    _queryController.dispose();
    _viewModel.removeListener(_onViewModelChanged);
    _viewModel.dispose();
    _searchViewModel.removeListener(_onViewModelChanged);
    _searchViewModel.dispose();
    locator<AppShellNavigationIntent>().removeListener(_onNavigationIntent);
    super.dispose();
  }

  List<SearchResult> get _filteredResults {
    final query = _query.trim().toLowerCase();
    return _searchViewModel.results.where((result) {
      final matchesCategory =
          _selectedCategory == null || result.category.id == _selectedCategory!.id;
      final matchesQuery =
          query.isEmpty ||
          result.service.name.toLowerCase().contains(query) ||
          result.category.name.toLowerCase().contains(query);
      return matchesCategory && matchesQuery;
    }).toList();
  }

  Widget _buildFilteredBody() {
    switch (_searchViewModel.status) {
      case SearchLoadStatus.loading:
        return const AppLoading(message: 'Buscando...');
      case SearchLoadStatus.error:
        return AppEmptyState(
          icon: AppIcons.error,
          title: 'No se pudieron cargar los resultados',
          description: _searchViewModel.errorMessage,
          actionLabel: 'Reintentar',
          onActionPressed: _searchViewModel.retry,
        );
      case SearchLoadStatus.success:
        final results = _filteredResults;
        if (results.isEmpty) {
          return const SearchEmptyState(
            title: 'Sin resultados',
            description:
                'No encontramos servicios que coincidan con tu búsqueda.',
            icon: Icons.search_off,
          );
        }
        return SearchResults(results: results);
    }
  }

  Widget _buildBrowseBody() {
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
            SlideIn(
              child: CategoriesSection(
                categories: _viewModel.categories,
                selectedCategory: _selectedCategory,
                onCategoryTap: _onCategoryTap,
              ),
            ),
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
      toolbar: [
        MarketplaceSearchBar(
          controller: _queryController,
          onChanged: _onQueryChanged,
        ),
        if (_isFiltering && _viewModel.status == MarketplaceLoadStatus.success) ...[
          const SizedBox(height: AppSpacing.space12),
          CategoriesSection(
            categories: _viewModel.categories,
            selectedCategory: _selectedCategory,
            onCategoryTap: _onCategoryTap,
          ),
        ],
      ],
      body: _isFiltering ? _buildFilteredBody() : _buildBrowseBody(),
    );
  }
}
