import 'package:flutter/material.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/ui/animations/scale_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../repositories/profile_repository.dart';
import '../view_models/profile_view_model.dart';
import '../widgets/profile_actions.dart';
import '../widgets/profile_address.dart';
import '../widgets/profile_contact.dart';
import '../widgets/profile_header.dart';
import '../widgets/profile_information.dart';
import '../widgets/profile_loading.dart';
import '../widgets/profile_statistics.dart';

/// Profile screen. Does NOT build its own `Scaffold` — it is meant to
/// live inside the App Shell's "Perfil" slot. Loads from the real
/// backend via [ProfileViewModel] (resolved from the service locator —
/// see `core/di/service_locator.dart`).
///
/// Shows a single, fixed account (no id-based lookup yet) — see the
/// feature README.
class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key, ProfileRepository? repository})
    : _repository = repository;

  /// Overridable for tests only — production call sites always resolve
  /// the real repository from the service locator.
  final ProfileRepository? _repository;

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  late final ProfileViewModel _viewModel = ProfileViewModel(
    widget._repository ?? locator<ProfileRepository>(),
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
      case ProfileLoadStatus.loading:
        return const ProfileLoading();
      case ProfileLoadStatus.error:
        return AppEmptyState(
          icon: AppIcons.error,
          title: 'No se pudo cargar el perfil',
          description: _viewModel.errorMessage,
          actionLabel: 'Reintentar',
          onActionPressed: _viewModel.retry,
        );
      case ProfileLoadStatus.success:
        final data = _viewModel.data!;
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            SlideIn(child: ProfileInformation(data: data)),
            const SizedBox(height: AppSpacing.space16),
            SlideIn(child: ProfileContact(data: data)),
            const SizedBox(height: AppSpacing.space16),
            SlideIn(child: ProfileAddress(data: data)),
            const SizedBox(height: AppSpacing.space16),
            ScaleIn(child: ProfileStatistics(data: data)),
            const SizedBox(height: AppSpacing.space16),
            const ProfileActions(),
          ],
        );
    }
  }

  Widget _buildHeader() {
    final data = _viewModel.data;
    if (data == null) return const AppSectionTitle(title: 'Perfil');
    return ProfileHeader(data: data);
  }

  @override
  Widget build(BuildContext context) {
    return AppPageBody(header: _buildHeader(), body: _buildBody());
  }
}
