import 'package:flutter/material.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/ui/animations/fade_in.dart';
import '../../../../core/ui/animations/scale_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/tokens/app_durations.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../../repositories/security_repository.dart';
import '../view_models/security_view_model.dart';
import '../widgets/add_auth_method_button.dart';
import '../widgets/audit_log_section.dart';
import '../widgets/auth_method_card.dart';
import '../widgets/credentials_section.dart';
import '../widgets/security_empty_state.dart';
import '../widgets/security_header.dart';
import '../widgets/security_loading.dart';
import '../widgets/security_statistics.dart';

/// Security screen. Does NOT build its own `Scaffold` — it is meant to
/// live within the existing navigation flow (opened from `Settings`).
/// Loads from the real backend via [SecurityViewModel] (resolved from
/// the service locator — see `core/di/service_locator.dart`).
///
/// Shows a fixed list of authentication methods (no id-based lookup
/// yet) — see the feature README.
class SecurityPage extends StatefulWidget {
  const SecurityPage({super.key, SecurityRepository? repository})
    : _repository = repository;

  /// Overridable for tests only — production call sites always resolve
  /// the real repository from the service locator.
  final SecurityRepository? _repository;

  @override
  State<SecurityPage> createState() => _SecurityPageState();
}

class _SecurityPageState extends State<SecurityPage> {
  late final SecurityViewModel _viewModel = SecurityViewModel(
    widget._repository ?? locator<SecurityRepository>(),
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
      case SecurityLoadStatus.loading:
        return const SecurityLoading();
      case SecurityLoadStatus.error:
        return AppEmptyState(
          icon: AppIcons.error,
          title: 'No se pudo cargar la seguridad de tu cuenta',
          description: _viewModel.errorMessage,
          actionLabel: 'Reintentar',
          onActionPressed: _viewModel.retry,
        );
      case SecurityLoadStatus.success:
        final data = _viewModel.data!;
        if (data.authMethods.isEmpty) return const SecurityEmptyState();
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            ScaleIn(child: SecurityStatistics(data: data)),
            const SizedBox(height: AppSpacing.space16),
            Column(
              children: [
                for (final (index, authMethod) in data.authMethods.indexed) ...[
                  FadeIn(
                    delay: staggerDelayFor(index),
                    child: SlideIn(
                      child: AuthMethodCard(authMethod: authMethod),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.space12),
                ],
              ],
            ),
            const AddAuthMethodButton(),
            const SizedBox(height: AppSpacing.space16),
            SlideIn(child: CredentialsSection(data: data)),
            const SizedBox(height: AppSpacing.space16),
            SlideIn(child: AuditLogSection(data: data)),
          ],
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppPageBody(
      header: _viewModel.status == SecurityLoadStatus.success
          ? SecurityHeader(data: _viewModel.data!)
          : const SizedBox.shrink(),
      body: _buildBody(),
    );
  }
}
