import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import '../../../../contact/entities/contact.dart';
import '../../../../contact/models/contact_id.dart';
import '../../../../contact/models/contact_status.dart';
import '../../../../contact/models/contact_type.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/navigation/routes/app_routes.dart';
import '../../../../core/session/session_manager.dart';
import '../../../../core/ui/animations/scale_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../../../core/ui/widgets/app_dialog.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../../../core/ui/widgets/app_snack_bar.dart';
import '../../../../core/ui/widgets/image_source_sheet.dart';
import '../../repositories/profile_repository.dart';
import '../view_models/profile_view_model.dart';
import '../widgets/edit_profile_sheet.dart';
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
  const ProfilePage({
    super.key,
    ProfileRepository? repository,
    SessionManager? sessionManager,
  }) : _repository = repository,
       _sessionManager = sessionManager;

  /// Overridable for tests only — production call sites always resolve
  /// the real repository/session manager from the service locator.
  final ProfileRepository? _repository;
  final SessionManager? _sessionManager;

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  late final ProfileRepository _repository =
      widget._repository ?? locator<ProfileRepository>();
  late final SessionManager _sessionManager =
      widget._sessionManager ?? locator<SessionManager>();
  late final ProfileViewModel _viewModel = ProfileViewModel(_repository);

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

  Future<void> _editProfile(BuildContext context) async {
    final data = _viewModel.data;
    if (data == null) return;

    String contactValue(ContactType type) => data.contacts
        .firstWhere(
          (contact) => contact.type == type,
          orElse: () => Contact(
            id: ContactId.create(),
            identityId: data.identity.id,
            type: type,
            value: '',
            status: ContactStatus.active,
            createdAt: DateTime.now(),
            updatedAt: DateTime.now(),
          ),
        )
        .value;

    final result = await EditProfileSheet.show(
      context,
      currentName: data.displayName,
      currentPhone: contactValue(ContactType.phone),
      currentEmail: contactValue(ContactType.email),
      currentAddressAlias: data.address.alias,
      currentFullAddress: data.address.fullAddress,
    );
    if (result == null) return;

    try {
      await Future.wait([
        _repository.updateDisplayName(result.displayName),
        _repository.updatePhone(result.phone),
        _repository.updateEmail(result.email),
        _repository.updateAddress(
          alias: result.addressAlias,
          fullAddress: result.fullAddress,
        ),
      ]);
      await _viewModel.retry();
      if (!context.mounted) return;
      AppSnackBar.show(
        context,
        'Perfil actualizado',
        type: AppSnackBarType.success,
      );
    } on Exception {
      if (!context.mounted) return;
      AppSnackBar.show(
        context,
        'No se pudo actualizar el perfil',
        type: AppSnackBarType.error,
      );
    }
  }

  Future<void> _changeAvatar(BuildContext context) async {
    final source = await ImageSourceSheet.show(context);
    if (source == null || !context.mounted) return;

    final picked = await ImagePicker().pickImage(
      source: source,
      maxWidth: 1024,
      imageQuality: 85,
    );
    if (picked == null || !context.mounted) return;

    try {
      final bytes = await picked.readAsBytes();
      await _repository.updateAvatar(
        fileBytes: bytes,
        fileName: picked.name,
      );
      await _viewModel.retry();
      if (!context.mounted) return;
      AppSnackBar.show(
        context,
        'Foto de perfil actualizada',
        type: AppSnackBarType.success,
      );
    } on Exception {
      if (!context.mounted) return;
      AppSnackBar.show(
        context,
        'No se pudo actualizar la foto de perfil',
        type: AppSnackBarType.error,
      );
    }
  }

  /// Confirms before ending the session — "Cerrar sesión" is the one
  /// destructive, hard-to-undo action on this screen (the user has to
  /// log back in), so an accidental tap shouldn't act immediately.
  Future<void> _logout(BuildContext context) async {
    final confirmed = await AppDialog.show<bool>(
      context,
      title: 'Cerrar sesión',
      content: const Text('¿Seguro que quieres cerrar sesión?'),
      actions: [
        AppButton(
          label: 'Cancelar',
          variant: AppButtonVariant.text,
          expand: false,
          onPressed: () => Navigator.of(context).pop(false),
        ),
        AppButton(
          label: 'Cerrar sesión',
          expand: false,
          onPressed: () => Navigator.of(context).pop(true),
        ),
      ],
    );
    if (confirmed != true) return;
    await _sessionManager.logout();
    // No explicit navigation: `AppRouteGuard` (wired to `SessionManager`
    // via `GoRouter.refreshListenable`) redirects to Login on its own
    // the moment the session clears.
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
            SlideIn(
              child: ProfileInformation(
                data: data,
                onAvatarTap: () => _changeAvatar(context),
              ),
            ),
            const SizedBox(height: AppSpacing.space16),
            SlideIn(child: ProfileContact(data: data)),
            const SizedBox(height: AppSpacing.space16),
            SlideIn(child: ProfileAddress(data: data)),
            const SizedBox(height: AppSpacing.space16),
            ScaleIn(child: ProfileStatistics(data: data)),
            const SizedBox(height: AppSpacing.space16),
            ProfileActions(
              onEditProfile: () => _editProfile(context),
              onLogout: () => _logout(context),
              showProviderDashboard: _sessionManager.currentRole == 'PROVIDER',
              showBecomeProvider: _sessionManager.currentRole != 'PROVIDER',
              onBecomeProvider: () => context.push(AppRoutes.becomeProvider),
            ),
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
