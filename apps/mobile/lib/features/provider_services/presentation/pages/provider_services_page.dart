import 'package:flutter/material.dart';
import '../../../../category/entities/category.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/ui/animations/scale_in.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';
import '../../../../core/ui/widgets/app_loading.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../../../../core/ui/widgets/app_snack_bar.dart';
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
  }) : _repository = repository;

  /// Overridable for tests only — production call sites always resolve
  /// the real repository from the service locator.
  final ProviderServicesRepository? _repository;

  @override
  State<ProviderServicesPage> createState() => _ProviderServicesPageState();
}

class _ProviderServicesPageState extends State<ProviderServicesPage> {
  late final ProviderServicesRepository _repository =
      widget._repository ?? locator<ProviderServicesRepository>();
  late final ProviderServicesViewModel _viewModel = ProviderServicesViewModel(
    _repository,
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

  List<Category> get _knownCategories {
    final seen = <String>{};
    final categories = <Category>[];
    for (final service in _viewModel.services) {
      if (seen.add(service.category.id.value)) categories.add(service.category);
    }
    return categories;
  }

  Future<void> _create() async {
    final categories = _knownCategories;
    final result = await ServiceFormSheet.show(context, categories: categories);
    if (result == null || !mounted) return;
    if (result.category == null) return;
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
    AppSnackBar.show(context, 'Servicio creado.', type: AppSnackBarType.success);
    await _viewModel.load();
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
    await _viewModel.load();
  }

  Future<void> _pause(ProviderServiceDisplay data) async {
    final isPaused = data.service.status == ServiceStatus.inactive;
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
    await _viewModel.load();
  }

  Future<void> _delete(ProviderServiceDisplay data) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Eliminar servicio'),
        content: Text(
          '¿Eliminar "${data.service.name}"? Esta acción no se puede deshacer.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Cancelar'),
          ),
          TextButton(
            onPressed: () => Navigator.of(context).pop(true),
            child: const Text('Eliminar'),
          ),
        ],
      ),
    );
    if (confirmed != true || !mounted) return;
    await _repository.deleteService(data.service);
    if (!mounted) return;
    AppSnackBar.show(context, 'Servicio eliminado.', type: AppSnackBarType.info);
    await _viewModel.load();
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
