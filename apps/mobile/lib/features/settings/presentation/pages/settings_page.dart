import 'package:flutter/material.dart';
import '../../../../core/ui/animations/fade_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../address_management/presentation/pages/address_management_page.dart';
import '../../models/settings_display.dart';
import '../../models/settings_option.dart';
import '../../repositories/mock_settings_repository.dart';
import '../widgets/settings_empty_state.dart';
import '../widgets/settings_header.dart';
import '../widgets/settings_loading.dart';
import '../widgets/settings_option_tile.dart';

/// The three purely-visual states this screen can render — same
/// fixed-`state` approach as every list/detail feature since `search`.
enum SettingsViewState { loading, empty, information }

/// Settings screen. Does NOT build its own `Scaffold` — it is meant to
/// live within the existing navigation flow (opened from `Profile`).
/// Completely independent: its own repository, its own mock data.
class SettingsPage extends StatelessWidget {
  const SettingsPage({super.key, this.state = SettingsViewState.information});

  final SettingsViewState state;

  SettingsDisplay _buildData() {
    final repository = MockSettingsRepository();

    return SettingsDisplay(
      profile: repository.getProfile(),
      options: repository.getOptions(),
    );
  }

  void _openAddresses(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (context) => Scaffold(
          appBar: AppBar(title: const Text('Mis direcciones')),
          body: const SafeArea(child: AddressManagementPage()),
        ),
      ),
    );
  }

  VoidCallback? _onTapFor(BuildContext context, SettingsOptionId option) {
    if (option == SettingsOptionId.addresses) {
      return () => _openAddresses(context);
    }
    return null;
  }

  Widget _buildBody(BuildContext context) {
    switch (state) {
      case SettingsViewState.loading:
        return const SettingsLoading();
      case SettingsViewState.empty:
        return const SettingsEmptyState();
      case SettingsViewState.information:
        final data = _buildData();
        return SlideIn(
          child: Column(
            children: [
              for (final option in data.options) ...[
                SettingsOptionTile(
                  option: option,
                  onTap: _onTapFor(context, option),
                ),
                const SizedBox(height: AppSpacing.space8),
              ],
            ],
          ),
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          FadeIn(child: SettingsHeader(data: _buildData())),
          const SizedBox(height: AppSpacing.space16),
          _buildBody(context),
        ],
      ),
    );
  }
}
