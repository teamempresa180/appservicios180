import 'package:flutter/material.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../../mock/mock_addresses_data.dart';
import '../../models/address_display.dart';
import '../../repositories/mock_address_management_repository.dart';
import '../widgets/add_address_button.dart';
import '../widgets/address_card.dart';
import '../widgets/address_form_preview.dart';
import '../widgets/addresses_empty_state.dart';
import '../widgets/addresses_header.dart';
import '../widgets/addresses_loading.dart';

/// The three purely-visual states this screen can render — same
/// fixed-`state` approach as every list/detail feature since `search`.
enum AddressManagementViewState { loading, empty, information }

/// Address Management screen. Does NOT build its own `Scaffold` — it
/// is meant to live within the existing navigation flow, the same way
/// every other feature so far does. Completely independent: its own
/// repository, its own mock data.
///
/// Shows a fixed list of addresses (no id-based lookup yet) — see the
/// feature README.
class AddressManagementPage extends StatelessWidget {
  const AddressManagementPage({
    super.key,
    this.state = AddressManagementViewState.information,
  });

  final AddressManagementViewState state;

  List<AddressDisplay> _buildAddresses() {
    final repository = MockAddressManagementRepository();
    final profile = repository.getProfile();

    return [
      for (final address in repository.getAddresses())
        AddressDisplay(
          address: address,
          profile: profile,
          contact: repository.getContactFor(address),
          isDefault: mockAddressIsDefault[address.id]!,
          deliveryInstructions: mockAddressDeliveryInstructions[address.id]!,
        ),
    ];
  }

  Widget _buildBody() {
    switch (state) {
      case AddressManagementViewState.loading:
        return const AddressesLoading();
      case AddressManagementViewState.empty:
        return const AddressesEmptyState();
      case AddressManagementViewState.information:
        final addresses = _buildAddresses();
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            SlideIn(
              child: Column(
                children: [
                  for (final address in addresses) ...[
                    AddressCard(data: address),
                    const SizedBox(height: AppSpacing.space12),
                  ],
                ],
              ),
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
