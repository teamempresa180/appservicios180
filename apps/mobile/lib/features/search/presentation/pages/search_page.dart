import 'package:flutter/material.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../../repositories/search_repository.dart';
import '../view_models/search_view_model.dart';
import '../widgets/search_bar.dart';
import '../widgets/search_empty_state.dart';
import '../widgets/search_header.dart';
import '../widgets/search_loading.dart';
import '../widgets/search_results.dart';

/// Search screen. Does NOT build its own `Scaffold` — it is meant to be
/// inserted into the App Shell later, the same way Home, Marketplace
/// and Categories already are. Completely independent of those
/// features: its own repository, its own view model, loaded from the
/// real backend via [SearchViewModel] (resolved from the service
/// locator — see `core/di/service_locator.dart`).
///
/// There is still no real free-text search tied to [SearchInputBar]'s
/// typing (`onChanged` stays a no-op) — only the initial full-list load
/// is real now (see the feature README).
class SearchPage extends StatefulWidget {
  const SearchPage({super.key, SearchRepository? repository})
    : _repository = repository;

  /// Overridable for tests only — production call sites always resolve
  /// the real repository from the service locator.
  final SearchRepository? _repository;

  @override
  State<SearchPage> createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage> {
  late final SearchViewModel _viewModel = SearchViewModel(
    widget._repository ?? locator<SearchRepository>(),
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
      case SearchLoadStatus.loading:
        return const SearchLoading();
      case SearchLoadStatus.error:
        return AppEmptyState(
          icon: AppIcons.error,
          title: 'No se pudieron cargar los resultados',
          description: _viewModel.errorMessage,
          actionLabel: 'Reintentar',
          onActionPressed: _viewModel.retry,
        );
      case SearchLoadStatus.success:
        if (_viewModel.results.isEmpty) {
          return const SearchEmptyState(
            title: 'Sin resultados',
            description:
                'No encontramos servicios que coincidan con tu búsqueda.',
            icon: Icons.search_off,
          );
        }
        return SearchResults(results: _viewModel.results);
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
