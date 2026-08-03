import 'package:flutter/material.dart';
import '../../../../category/entities/category.dart';
import '../../../../core/di/service_locator.dart';
import '../../../categories/repositories/category_repository.dart';
import '../../../../core/ui/animations/scale_in.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../../../core/ui/widgets/app_dialog.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';
import '../../../../core/ui/widgets/app_loading.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../../../../core/ui/widgets/app_snack_bar.dart';
import '../../../../core/network/http_exceptions.dart';
import '../../../../service/models/service_status.dart';
import '../../models/provider_service_display.dart';
import '../../repositories/provider_services_repository.dart';
import '../view_models/provider_services_view_model.dart';
import '../widgets/add_service_button.dart';
import '../widgets/service_form_sheet.dart';
import '../widgets/services_empty_state.dart';
import '../widgets/services_header.dart';
import '../widgets/services_list.dart';
import '../widgets/services_statistics.dart';

/// Provider Services screen. Does NOT build its own `Scaffold` — it is
/// meant to live within the existing navigation flow (opened from
/// `Provider Dashboard`). Loads from the real backend via
/// [ProviderServicesViewModel] (resolved from the service locator —
/// see `core/di/service_locator.dart`). "Nuevo servicio"/"Editar"/
/// "Pausar"/"Eliminar" all call through to the real
/// `ProviderServicesRepository` CRUD methods.
class ProviderServicesPage extends StatefulWidget {
  const ProviderServicesPage({
    super.key,
    ProviderServicesRepository? repository,
    CategoryRepository? categoryRepository,
  }) : _repository = repository,
       _categoryRepository = categoryRepository;

  /// Overridable for tests only — production call sites always resolve
  /// the real repository from the service locator.
  final ProviderServicesRepository? _repository;
  final CategoryRepository? _categoryRepository;

  @override
  State<ProviderServicesPage> createState() => _ProviderServicesPageState();
}

class _ProviderServicesPageState extends State<ProviderServicesPage> {
  late final ProviderServicesRepository _repository =
      widget._repository ?? locator<ProviderServicesRepository>();
  late final ProviderServicesViewModel _viewModel = ProviderServicesViewModel(
    _repository,
  );
  late final CategoryRepository _categoryRepository =
      widget._categoryRepository ?? locator<CategoryRepository>();

  /// The full category catalog, used as the source for "Nuevo servicio"
  /// so a provider with zero existing services (and therefore no
  /// [_knownCategories]) can still pick a category — falls back to
  /// [_knownCategories] if this fails to load (offline, etc.).
  List<Category> _catalogCategories = const [];

  @override
  void initState() {
    super.initState();
    _viewModel.load();
    _viewModel.addListener(_onViewModelChanged);
    _loadCatalogCategories();
  }

  Future<bool> _loadCatalogCategories() async {
    try {
      final categories = await _categoryRepository.getAll();
      if (!mounted) return false;
      setState(() => _catalogCategories = categories);
      return categories.isNotEmpty;
    } catch (_) {
      // Falls back to _knownCategories in _create(); no user-facing
      // error needed here since this is a background enhancement, not
      // the primary load — _create() is where a still-empty catalog
      // becomes visible to the user, and it says so there.
      return false;
    }
  }

  void _onViewModelChanged() => setState(() {});

  @override
  void dispose() {
    _viewModel.removeListener(_onViewModelChanged);
    _viewModel.dispose();
    super.dispose();
  }

  List<Category> get _knownCategories {
    final seen = <String>{};
    final categories = <Category>[];
    for (final service in _viewModel.services) {
      if (seen.add(service.category.id.value)) categories.add(service.category);
    }
    return categories;
  }

  /// Resolves the categories the "Nuevo servicio" sheet can offer.
  /// The catalog load in [initState] is a background enhancement that
  /// can silently fail (offline, backend hiccup) — when it did, this
  /// used to open a sheet whose "Guardar" button was permanently
  /// disabled with no way out: a dead end. Now it retries the catalog
  /// once on demand and, if there is still nothing to pick, explains
  /// why instead of opening an unusable form.
  Future<List<Category>?> _resolveCategories() async {
    var categories = _catalogCategories.isNotEmpty
        ? _catalogCategories
        : _knownCategories;
    if (categories.isEmpty) {
      await _loadCatalogCategories();
      if (!mounted) return null;
      categories = _catalogCategories.isNotEmpty
          ? _catalogCategories
          : _knownCategories;
    }
    if (categories.isEmpty) {
      AppSnackBar.show(
        context,
        'No pudimos cargar las categorías. Revisa tu conexión e '
        'intenta de nuevo.',
        type: AppSnackBarType.error,
      );
      return null;
    }
    return categories;
  }

  Future<void> _create() async {
    final categories = await _resolveCategories();
    if (categories == null || !mounted) return;
    final result = await ServiceFormSheet.show(context, categories: categories);
    if (result == null || !mounted) return;
    if (result.category == null) return;
    try {
      final provider = await _repository.getProvider();
      await _repository.createService(
        provider: provider,
        category: result.category!,
        name: result.name!,
        description: result.description!,
        basePrice: result.basePrice,
        estimatedDuration: result.estimatedDuration,
        type: result.type!,
      );
      if (!mounted) return;
      AppSnackBar.show(
        context,
        'Servicio creado.',
        type: AppSnackBarType.success,
      );
      await _viewModel.refresh();
    } on HttpException catch (exception) {
      if (!mounted) return;
      AppSnackBar.show(context, exception.message, type: AppSnackBarType.error);
    } catch (_) {
      // `getProvider()` throws a plain `StateError` when the session
      // has no Provider record — without this the failure escaped as
      // an unhandled async error and the user saw nothing at all.
      if (!mounted) return;
      AppSnackBar.show(
        context,
        'No se pudo completar la acción. Intenta de nuevo.',
        type: AppSnackBarType.error,
      );
    }
  }

  Future<void> _edit(ProviderServiceDisplay data) async {
    final result = await ServiceFormSheet.show(
      context,
      isEditing: true,
      initialName: data.service.name,
      initialDescription: data.service.description,
      initialBasePrice: data.service.basePrice,
      initialEstimatedDuration: data.service.estimatedDuration,
    );
    if (result == null || !mounted) return;
    try {
      await _repository.updateService(
        data.service,
        basePrice: result.basePrice,
        estimatedDuration: result.estimatedDuration,
      );
      if (!mounted) return;
      AppSnackBar.show(
        context,
        'Servicio actualizado.',
        type: AppSnackBarType.success,
      );
      await _viewModel.refresh();
    } on HttpException catch (exception) {
      if (!mounted) return;
      AppSnackBar.show(context, exception.message, type: AppSnackBarType.error);
    } catch (_) {
      // `getProvider()` throws a plain `StateError` when the session
      // has no Provider record — without this the failure escaped as
      // an unhandled async error and the user saw nothing at all.
      if (!mounted) return;
      AppSnackBar.show(
        context,
        'No se pudo completar la acción. Intenta de nuevo.',
        type: AppSnackBarType.error,
      );
    }
  }

  Future<void> _pause(ProviderServiceDisplay data) async {
    final isPaused = data.service.status == ServiceStatus.inactive;
    try {
      await _repository.updateService(
        data.service,
        status: isPaused ? ServiceStatus.active : ServiceStatus.inactive,
      );
      if (!mounted) return;
      AppSnackBar.show(
        context,
        isPaused ? 'Servicio reactivado.' : 'Servicio pausado.',
        type: AppSnackBarType.info,
      );
      await _viewModel.refresh();
    } on HttpException catch (exception) {
      if (!mounted) return;
      AppSnackBar.show(context, exception.message, type: AppSnackBarType.error);
    } catch (_) {
      // `getProvider()` throws a plain `StateError` when the session
      // has no Provider record — without this the failure escaped as
      // an unhandled async error and the user saw nothing at all.
      if (!mounted) return;
      AppSnackBar.show(
        context,
        'No se pudo completar la acción. Intenta de nuevo.',
        type: AppSnackBarType.error,
      );
    }
  }

  Future<void> _delete(ProviderServiceDisplay data) async {
    final confirmed = await AppDialog.show<bool>(
      context,
      title: 'Eliminar servicio',
      content: Text(
        '¿Eliminar "${data.service.name}"? Esta acción no se puede deshacer.',
      ),
      actions: [
        AppButton(
          label: 'Cancelar',
          variant: AppButtonVariant.text,
          expand: false,
          onPressed: () => Navigator.of(context).pop(false),
        ),
        AppButton(
          label: 'Eliminar',
          expand: false,
          onPressed: () => Navigator.of(context).pop(true),
        ),
      ],
    );
    if (confirmed != true || !mounted) return;
    try {
      await _repository.deleteService(data.service);
      if (!mounted) return;
      AppSnackBar.show(
        context,
        'Servicio eliminado.',
        type: AppSnackBarType.info,
      );
      await _viewModel.refresh();
    } on HttpException catch (exception) {
      if (!mounted) return;
      AppSnackBar.show(context, exception.message, type: AppSnackBarType.error);
    } catch (_) {
      // `getProvider()` throws a plain `StateError` when the session
      // has no Provider record — without this the failure escaped as
      // an unhandled async error and the user saw nothing at all.
      if (!mounted) return;
      AppSnackBar.show(
        context,
        'No se pudo completar la acción. Intenta de nuevo.',
        type: AppSnackBarType.error,
      );
    }
  }

  Widget _buildBody() {
    switch (_viewModel.status) {
      case ProviderServicesLoadStatus.loading:
        return const AppLoading(message: 'Cargando servicios...');
      case ProviderServicesLoadStatus.error:
        return AppEmptyState(
          icon: AppIcons.error,
          title: 'No se pudieron cargar los servicios',
          description: _viewModel.errorMessage,
          actionLabel: 'Reintentar',
          onActionPressed: _viewModel.retry,
        );
      case ProviderServicesLoadStatus.success:
        final services = _viewModel.services;
        if (services.isEmpty) {
          return Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const ServicesEmptyState(),
              const SizedBox(height: AppSpacing.space16),
              AddServiceButton(onPressed: _create),
            ],
          );
        }
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            ScaleIn(child: ServicesStatistics(services: services)),
            const SizedBox(height: AppSpacing.space16),
            AddServiceButton(onPressed: _create),
            const SizedBox(height: AppSpacing.space16),
            ServicesList(
              services: services,
              onEdit: _edit,
              onPause: _pause,
              onDelete: _delete,
            ),
          ],
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppPageBody(header: const ServicesHeader(), body: _buildBody());
  }
}
