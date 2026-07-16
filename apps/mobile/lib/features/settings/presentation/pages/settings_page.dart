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
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../../address_management/presentation/pages/address_management_page.dart';
import '../../../contact_management/presentation/pages/contact_management_page.dart';
import '../../../security/presentation/pages/security_page.dart';
import '../../models/settings_option.dart';
import '../../repositories/settings_repository.dart';
import '../view_models/settings_view_model.dart';
import '../widgets/settings_header.dart';
import '../widgets/settings_option_tile.dart';

/// Settings screen. Does NOT build its own `Scaffold` — it is meant to
/// live within the existing navigation flow (opened from `Profile`).
/// Loads from the real backend via [SettingsViewModel] (resolved from
/// the service locator — see `core/di/service_locator.dart`).
class SettingsPage extends StatefulWidget {
  const SettingsPage({super.key, SettingsRepository? repository})
    : _repository = repository;

  /// Overridable for tests only — production call sites always resolve
  /// the real repository from the service locator.
  final SettingsRepository? _repository;

  @override
  State<SettingsPage> createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  late final SettingsViewModel _viewModel = SettingsViewModel(
    widget._repository ?? locator<SettingsRepository>(),
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

  void _openContacts(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (context) => Scaffold(
          appBar: AppBar(title: const Text('Mis contactos')),
          body: const SafeArea(child: ContactManagementPage()),
        ),
      ),
    );
  }

  void _openSecurity(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (context) => Scaffold(
          appBar: AppBar(title: const Text('Seguridad')),
          body: const SafeArea(child: SecurityPage()),
        ),
      ),
    );
  }

  VoidCallback? _onTapFor(BuildContext context, SettingsOptionId option) {
    switch (option) {
      case SettingsOptionId.addresses:
        return () => _openAddresses(context);
      case SettingsOptionId.contacts:
        return () => _openContacts(context);
      case SettingsOptionId.security:
        return () => _openSecurity(context);
      case SettingsOptionId.notifications:
      case SettingsOptionId.privacy:
      case SettingsOptionId.help:
      case SettingsOptionId.logout:
        return null;
    }
  }

  Widget _buildBody(BuildContext context) {
    switch (_viewModel.status) {
      case SettingsLoadStatus.loading:
        return const AppLoading(message: 'Cargando configuración...');
      case SettingsLoadStatus.error:
        return AppEmptyState(
          icon: AppIcons.error,
          title: 'No se pudo cargar la configuración',
          description: _viewModel.errorMessage,
          actionLabel: 'Reintentar',
          onActionPressed: _viewModel.retry,
        );
      case SettingsLoadStatus.success:
        final data = _viewModel.data!;
        return Column(
          children: [
            for (final (index, option) in data.options.indexed) ...[
              FadeIn(
                delay: staggerDelayFor(index),
                child: SlideIn(
                  child: SettingsOptionTile(
                    option: option,
                    onTap: _onTapFor(context, option),
                  ),
                ),
              ),
              const SizedBox(height: AppSpacing.space8),
            ],
          ],
        );
    }
  }

  Widget _buildHeader() {
    final data = _viewModel.data;
    if (data == null) return const AppSectionTitle(title: 'Configuración');
    return SettingsHeader(data: data);
  }

  @override
  Widget build(BuildContext context) {
    return AppPageBody(header: _buildHeader(), body: _buildBody(context));
  }
}
