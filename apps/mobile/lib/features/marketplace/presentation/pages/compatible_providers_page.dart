import 'dart:async';

import 'package:flutter/material.dart';
import '../../../../category/entities/category.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';
import '../../../../core/ui/widgets/app_loading.dart';
import '../../../../core/ui/widgets/app_text_field.dart';
import '../../repositories/provider_repository.dart';
import '../view_models/compatible_providers_view_model.dart';
import '../widgets/provider_card.dart';

/// Marketplace's category → specialization → compatible-providers
/// browse flow. Given a real [category] (tapped from `CategoriesSection`
/// or reached from `ProviderProfilePage`'s "Publicar solicitud
/// abierta"), lets the client optionally narrow by a free-text
/// specialization, then calls
/// `GET /providers/compatible?categoryId=&specialization=` and shows
/// the real, matching providers — reusing `ProviderCard` so tapping one
/// still opens the real `ProviderProfilePage` (already correctly wired).
class CompatibleProvidersPage extends StatefulWidget {
  const CompatibleProvidersPage({
    super.key,
    required this.category,
    ProviderRepository? repository,
  }) : _repository = repository;

  final Category category;

  /// Overridable for tests only — production call sites always resolve
  /// the real repository from the service locator.
  final ProviderRepository? _repository;

  @override
  State<CompatibleProvidersPage> createState() =>
      _CompatibleProvidersPageState();
}

class _CompatibleProvidersPageState extends State<CompatibleProvidersPage> {
  late final CompatibleProvidersViewModel _viewModel =
      CompatibleProvidersViewModel(
        widget._repository ?? locator<ProviderRepository>(),
        widget.category,
      );
  final TextEditingController _specializationController =
      TextEditingController();
  Timer? _debounce;

  @override
  void initState() {
    super.initState();
    _viewModel.search();
    _viewModel.addListener(_onViewModelChanged);
  }

  void _onViewModelChanged() => setState(() {});

  /// Waits for a short pause in typing before actually searching —
  /// without this, every keystroke fired its own request and flashed
  /// the whole grid to a loading state, which looked broken/flickery
  /// even though each individual request was fine.
  void _onSpecializationChanged(String value) {
    _debounce?.cancel();
    _debounce = Timer(
      const Duration(milliseconds: 400),
      () => _viewModel.search(value),
    );
  }

  @override
  void dispose() {
    _debounce?.cancel();
    _viewModel.removeListener(_onViewModelChanged);
    _viewModel.dispose();
    _specializationController.dispose();
    super.dispose();
  }

  Widget _buildBody() {
    switch (_viewModel.status) {
      case CompatibleProvidersLoadStatus.loading:
        return const AppLoading(message: 'Buscando proveedores...');
      case CompatibleProvidersLoadStatus.error:
        return AppEmptyState(
          icon: AppIcons.error,
          title: 'No se pudieron cargar los proveedores',
          description: _viewModel.errorMessage,
          actionLabel: 'Reintentar',
          onActionPressed: _viewModel.retry,
        );
      case CompatibleProvidersLoadStatus.success:
        final providers = _viewModel.providers;
        if (providers.isEmpty) {
          return const AppEmptyState(
            icon: AppIcons.search,
            title: 'Sin proveedores disponibles',
            description:
                'No encontramos proveedores para esta categoría/especialidad.',
          );
        }
        return GridView.builder(
          padding: const EdgeInsets.only(top: AppSpacing.space8),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            mainAxisSpacing: AppSpacing.space12,
            crossAxisSpacing: AppSpacing.space12,
            childAspectRatio: 0.8,
          ),
          itemCount: providers.length,
          itemBuilder: (context, index) => ProviderCard(display: providers[index]),
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(AppSpacing.space16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            widget.category.name,
            style: context.textStyles.titleLarge,
          ),
          const SizedBox(height: AppSpacing.space12),
          AppTextField(
            controller: _specializationController,
            label: 'Especialidad (opcional)',
            hint: 'Ej. instalaciones eléctricas',
            prefixIcon: AppIcons.search,
            onChanged: _onSpecializationChanged,
          ),
          const SizedBox(height: AppSpacing.space16),
          Expanded(child: _buildBody()),
        ],
      ),
    );
  }
}
