import 'package:flutter/material.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/ui/animations/scale_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';
import '../../../../core/ui/widgets/app_loading.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../../../core/ui/widgets/app_snack_bar.dart';
import '../../repositories/verification_repository.dart';
import '../view_models/verification_view_model.dart';
import '../widgets/document_preview.dart';
import '../widgets/selfie_preview.dart';
import '../widgets/submit_verification_button.dart';
import '../widgets/verification_actions.dart';
import '../widgets/verification_header.dart';
import '../widgets/verification_status.dart';
import '../widgets/verification_steps.dart';

/// Verification screen. Does NOT build its own `Scaffold` — it is
/// meant to live within the existing navigation flow (opened from
/// `Provider Profile`). Loads from the real backend via
/// [VerificationViewModel] (resolved from the service locator — see
/// `core/di/service_locator.dart`). No real authentication involved —
/// see the feature README.
class VerificationPage extends StatefulWidget {
  const VerificationPage({super.key, VerificationRepository? repository})
    : _repository = repository;

  /// Overridable for tests only — production call sites always resolve
  /// the real repository from the service locator.
  final VerificationRepository? _repository;

  @override
  State<VerificationPage> createState() => _VerificationPageState();
}

class _VerificationPageState extends State<VerificationPage> {
  late final VerificationViewModel _viewModel = VerificationViewModel(
    widget._repository ?? locator<VerificationRepository>(),
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

  /// This screen shows a fixed, visual-only verification status (see
  /// the class doc — there is no real backend Verification-by-provider
  /// lookup yet), so "Tomar foto"/"Subir documento"/"Reintentar"/
  /// "Enviar para revisión" have nothing real to do. A silent no-op
  /// still reads as a broken button to whoever taps it, so each one
  /// now at least confirms it isn't wired up instead of doing nothing.
  void _notImplementedYet(BuildContext context) {
    AppSnackBar.show(
      context,
      'Esta acción estará disponible próximamente.',
      type: AppSnackBarType.info,
    );
  }

  Widget _buildBody() {
    switch (_viewModel.status) {
      case VerificationLoadStatus.loading:
        return const AppLoading(message: 'Cargando verificación...');
      case VerificationLoadStatus.error:
        return AppEmptyState(
          icon: AppIcons.error,
          title: 'No se pudo cargar la verificación',
          description: _viewModel.errorMessage,
          actionLabel: 'Reintentar',
          onActionPressed: _viewModel.retry,
        );
      case VerificationLoadStatus.success:
        final data = _viewModel.data!;
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            SlideIn(child: DocumentPreview(data: data)),
            const SizedBox(height: AppSpacing.space16),
            const SlideIn(child: SelfiePreview()),
            const SizedBox(height: AppSpacing.space16),
            ScaleIn(child: VerificationStatusCard(data: data)),
            const SizedBox(height: AppSpacing.space16),
            SlideIn(child: VerificationSteps(data: data)),
            const SizedBox(height: AppSpacing.space16),
            VerificationActions(
              onTakePhoto: () => _notImplementedYet(context),
              onUploadDocument: () => _notImplementedYet(context),
              onRetry: () => _notImplementedYet(context),
            ),
            const SizedBox(height: AppSpacing.space16),
            SubmitVerificationButton(
              onPressed: () => _notImplementedYet(context),
            ),
          ],
        );
    }
  }

  Widget _buildHeader() {
    final data = _viewModel.data;
    if (data == null) {
      return const AppSectionTitle(title: 'Verificación de identidad');
    }
    return VerificationHeader(data: data);
  }

  @override
  Widget build(BuildContext context) {
    return AppPageBody(header: _buildHeader(), body: _buildBody());
  }
}
