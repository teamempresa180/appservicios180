import 'package:flutter/material.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/network/http_exceptions.dart';
import '../../../../core/ui/animations/fade_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/tokens/app_durations.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../../../../core/ui/widgets/app_snack_bar.dart';
import '../../models/address_display.dart';
import '../../repositories/address_management_repository.dart';
import '../view_models/address_management_view_model.dart';
import '../widgets/add_address_button.dart';
import '../widgets/address_card.dart';
import '../widgets/address_form_sheet.dart';
import '../widgets/addresses_empty_state.dart';
import '../widgets/addresses_header.dart';
import '../widgets/addresses_loading.dart';

/// Address Management screen. Does NOT build its own `Scaffold` — it
/// is meant to live within the existing navigation flow, the same way
/// every other feature so far does. Loads from the real backend via
/// [AddressManagementViewModel] (resolved from the service locator —
/// see `core/di/service_locator.dart`). "Agregar dirección"/"Editar"/
/// "Eliminar" all call through to the real `AddressManagementRepository`
/// CRUD methods.
class AddressManagementPage extends StatefulWidget {
  const AddressManagementPage({super.key, AddressManagementRepository? repository})
    : _repository = repository;

  /// Overridable for tests only — production call sites always resolve
  /// the real repository from the service locator.
  final AddressManagementRepository? _repository;

  @override
  State<AddressManagementPage> createState() => _AddressManagementPageState();
}

class _AddressManagementPageState extends State<AddressManagementPage> {
  late final AddressManagementRepository _repository =
      widget._repository ?? locator<AddressManagementRepository>();
  late final AddressManagementViewModel _viewModel = AddressManagementViewModel(
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

  Future<void> _create() async {
    final result = await AddressFormSheet.show(context);
    if (result == null || !mounted) return;
    try {
      await _repository.createAddress(
        alias: result.alias,
        fullAddress: result.fullAddress,
        city: result.city!,
        state: result.state!,
        country: result.country!,
        postalCode: result.postalCode!,
        type: result.type!,
      );
      if (!mounted) return;
      AppSnackBar.show(
        context,
        'Dirección agregada.',
        type: AppSnackBarType.success,
      );
      await _viewModel.load();
    } on HttpException catch (exception) {
      if (!mounted) return;
      AppSnackBar.show(context, exception.message, type: AppSnackBarType.error);
    }
  }

  Future<void> _edit(AddressDisplay data) async {
    final result = await AddressFormSheet.show(
      context,
      isEditing: true,
      initialAlias: data.address.alias,
      initialFullAddress: data.address.fullAddress,
    );
    if (result == null || !mounted) return;
    try {
      await _repository.updateAddress(
        data.address,
        alias: result.alias,
        fullAddress: result.fullAddress,
      );
      if (!mounted) return;
      AppSnackBar.show(
        context,
        'Dirección actualizada.',
        type: AppSnackBarType.success,
      );
      await _viewModel.load();
    } on HttpException catch (exception) {
      if (!mounted) return;
      AppSnackBar.show(context, exception.message, type: AppSnackBarType.error);
    }
  }

  Future<void> _delete(AddressDisplay data) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Eliminar dirección'),
        content: Text('¿Eliminar "${data.label}"? Esta acción no se puede deshacer.'),
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
    try {
      await _repository.deleteAddress(data.address);
      if (!mounted) return;
      AppSnackBar.show(
        context,
        'Dirección eliminada.',
        type: AppSnackBarType.info,
      );
      await _viewModel.load();
    } on HttpException catch (exception) {
      if (!mounted) return;
      AppSnackBar.show(context, exception.message, type: AppSnackBarType.error);
    }
  }

  Widget _buildBody() {
    switch (_viewModel.status) {
      case AddressManagementLoadStatus.loading:
        return const AddressesLoading();
      case AddressManagementLoadStatus.error:
        return AppEmptyState(
          icon: AppIcons.error,
          title: 'No se pudieron cargar las direcciones',
          description: _viewModel.errorMessage,
          actionLabel: 'Reintentar',
          onActionPressed: _viewModel.retry,
        );
      case AddressManagementLoadStatus.success:
        final addresses = _viewModel.addresses;
        if (addresses.isEmpty) return const AddressesEmptyState();
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Column(
              children: [
                for (final (index, address) in addresses.indexed) ...[
                  FadeIn(
                    delay: staggerDelayFor(index),
                    child: SlideIn(
                      child: AddressCard(
                        data: address,
                        onEdit: () => _edit(address),
                        onDelete: () => _delete(address),
                      ),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.space12),
                ],
              ],
            ),
            AddAddressButton(onPressed: _create),
          ],
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppPageBody(header: const AddressesHeader(), body: _buildBody());
  }
}
