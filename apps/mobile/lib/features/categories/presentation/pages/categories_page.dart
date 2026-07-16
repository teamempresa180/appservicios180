import 'package:flutter/material.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';
import '../../../../core/ui/widgets/app_loading.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../../repositories/category_repository.dart';
import '../view_models/categories_view_model.dart';
import '../widgets/categories_grid.dart';
import '../widgets/categories_header.dart';

/// Categories screen: every category, in a responsive grid, loaded from
/// the real backend via [CategoriesViewModel] (resolved from the
/// service locator — see `core/di/service_locator.dart`). Does NOT
/// build its own `Scaffold` — it is meant to be inserted into the App
/// Shell later (see the feature README), the same way Home and
/// Marketplace already are. Completely independent of the Marketplace
/// feature: its own repository, its own view model.
class CategoriesPage extends StatefulWidget {
  const CategoriesPage({super.key, CategoryRepository? repository})
    : _repository = repository;

  /// Overridable for tests only — production call sites always resolve
  /// the real repository from the service locator.
  final CategoryRepository? _repository;

  @override
  State<CategoriesPage> createState() => _CategoriesPageState();
}

class _CategoriesPageState extends State<CategoriesPage> {
  late final CategoriesViewModel _viewModel = CategoriesViewModel(
    widget._repository ?? locator<CategoryRepository>(),
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
    return AppPageBody(
      header: const CategoriesHeader(),
      body: switch (_viewModel.status) {
        CategoriesLoadStatus.loading => const AppLoading(
          message: 'Cargando categorías...',
        ),
        CategoriesLoadStatus.error => AppEmptyState(
          icon: AppIcons.error,
          title: 'No se pudieron cargar las categorías',
          description: _viewModel.errorMessage,
          actionLabel: 'Reintentar',
          onActionPressed: _viewModel.retry,
        ),
        CategoriesLoadStatus.success => CategoriesGrid(
          categories: _viewModel.categories,
        ),
      },
    );
  }
}
