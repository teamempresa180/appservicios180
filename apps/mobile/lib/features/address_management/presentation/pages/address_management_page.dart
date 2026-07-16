import 'package:flutter/material.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/ui/animations/fade_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/tokens/app_durations.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';
import '../../../../core/ui/widgets/app_loading.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../../repositories/address_management_repository.dart';
import '../view_models/address_management_view_model.dart';
import '../widgets/add_address_button.dart';
import '../widgets/address_card.dart';
import '../widgets/address_form_preview.dart';
import '../widgets/addresses_empty_state.dart';
import '../widgets/addresses_header.dart';

/// Address Management screen. Does NOT build its own `Scaffold` — it
/// is meant to live within the existing navigation flow, the same way
/// every other feature so far does. Loads from the real backend via
/// [AddressManagementViewModel] (resolved from the service locator —
/// see `core/di/service_locator.dart`).
///
/// Shows a fixed list of addresses (no id-based lookup yet) — see the
/// feature README.
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
  late final AddressManagementViewModel _viewModel = AddressManagementViewModel(
    widget._repository ?? locator<AddressManagementRepository>(),
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
      case AddressManagementLoadStatus.loading:
        return const AppLoading(message: 'Cargando direcciones...');
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
                    child: SlideIn(child: AddressCard(data: address)),
                  ),
                  const SizedBox(height: AppSpacing.space12),
                ],
              ],
            ),
            const AddAddressButton(),
            const SizedBox(height: AppSpacing.space16),
            const AddressFormPreview(),
          ],
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppPageBody(header: const AddressesHeader(), body: _buildBody());
  }
}
