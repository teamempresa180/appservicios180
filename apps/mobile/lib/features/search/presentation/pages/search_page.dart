import 'package:flutter/material.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../../mock/mock_search_data.dart';
import '../../models/search_result.dart';
import '../../repositories/mock_search_repository.dart';
import '../widgets/search_bar.dart';
import '../widgets/search_empty_state.dart';
import '../widgets/search_header.dart';
import '../widgets/search_loading.dart';
import '../widgets/search_results.dart';

/// The four purely-visual states this screen can render. No real
/// search logic ties typing in [SearchInputBar] to any of these — see
/// the feature README.
enum SearchViewState { loading, empty, results, noResults }

/// Search screen. Does NOT build its own `Scaffold` — it is meant to be
/// inserted into the App Shell later, the same way Home, Marketplace
/// and Categories already are. Completely independent of those
/// features: its own repository, its own mock data.
///
/// [state] only picks which of the four visual states renders — there
/// is no real async fetch, no state management, just a fixed switch for
/// previewing each state (see the feature README).
class SearchPage extends StatelessWidget {
  const SearchPage({super.key, this.state = SearchViewState.results});

  final SearchViewState state;

  List<SearchResult> _buildResults() {
    final services = MockSearchRepository().getAll();

    return [
      for (final service in services)
        SearchResult(
          service: service,
          provider: mockSearchProviders.firstWhere(
            (provider) => provider.id == service.providerId,
          ),
          category: mockSearchCategories.firstWhere(
            (category) => category.id == service.categoryId,
          ),
          rating: mockSearchRatings[service.id.value] ?? 4.5,
          reviewsCount: mockSearchReviewsCount[service.id.value] ?? 0,
          distance: mockSearchDistanceKm[service.id.value] ?? 1.0,
        ),
    ];
  }

  Widget _buildBody() {
    switch (state) {
      case SearchViewState.loading:
        return const SearchLoading();
      case SearchViewState.empty:
        return const SearchEmptyState(
          title: 'Busca un servicio',
          description: 'Escribe algo para comenzar a buscar.',
          icon: AppIcons.search,
        );
      case SearchViewState.noResults:
        return const SearchEmptyState(
          title: 'Sin resultados',
          description:
              'No encontramos servicios que coincidan con tu búsqueda.',
          icon: Icons.search_off,
        );
      case SearchViewState.results:
        return SearchResults(results: _buildResults());
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppPageBody(
      header: const SearchHeader(),
      toolbar: const [SearchInputBar()],
      body: _buildBody(),
    );
  }
}
