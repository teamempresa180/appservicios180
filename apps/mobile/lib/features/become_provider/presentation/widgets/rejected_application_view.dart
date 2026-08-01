import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../../../core/ui/widgets/app_loading.dart';
import '../../../../core/ui/widgets/app_snack_bar.dart';
import '../../../../provider/entities/provider.dart';
import '../../../../verification/entities/verification.dart';
import '../../../../verification/models/verification_status.dart';
import '../../models/required_provider_documents.dart';
import '../../repositories/become_provider_repository.dart';
import 'document_upload_field.dart';

/// Shown instead of the generic "rechazado" copy when the applicant's
/// `Provider` is `ProviderStatus.rejected`: lets them re-upload every
/// rejected document, then resubmit — using the real, already-existing
/// `PUT /verifications/:id` and `PUT /providers/:id` endpoints (both
/// accept a `status` field) to move everything back to `pending`. No
/// backend change needed for this flow.
///
/// **Known gap**: neither `Verification` nor `Provider` has a
/// rejection-reason field on the backend today, so this view can only
/// show *which* documents were rejected (from each `Verification`'s
/// own `status`), never *why*. Once the backend adds one, the reason
/// belongs right above the document list below.
class RejectedApplicationView extends StatefulWidget {
  const RejectedApplicationView({
    super.key,
    required this.provider,
    required this.repository,
    required this.onResubmitted,
  });

  final Provider provider;
  final BecomeProviderRepository repository;
  final VoidCallback onResubmitted;

  @override
  State<RejectedApplicationView> createState() =>
      _RejectedApplicationViewState();
}

enum _Status { loading, loaded, error }

class _RejectedApplicationViewState extends State<RejectedApplicationView> {
  _Status _status = _Status.loading;
  List<Verification> _rejected = const [];
  final Set<String> _resolvedIds = {};
  bool _resubmitting = false;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _status = _Status.loading);
    try {
      final verifications = await widget.repository.ensureDocumentVerifications();
      if (!mounted) return;
      setState(() {
        _rejected = verifications
            .where((v) => v.status == VerificationStatus.rejected)
            .toList();
        _status = _Status.loaded;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() => _status = _Status.error);
    }
  }

  bool get _allResolved =>
      _rejected.isNotEmpty && _rejected.every((v) => _resolvedIds.contains(v.id.value));

  Future<void> _resubmit() async {
    setState(() => _resubmitting = true);
    try {
      await widget.repository.resetProviderStatus(widget.provider);
      if (!mounted) return;
      widget.onResubmitted();
    } catch (_) {
      if (!mounted) return;
      setState(() => _resubmitting = false);
      AppSnackBar.show(
        context,
        'No se pudo reenviar la solicitud. Inténtalo de nuevo.',
        type: AppSnackBarType.error,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_status == _Status.loading) {
      return const AppLoading(message: 'Cargando tus documentos...');
    }
    if (_status == _Status.error) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            'No se pudieron cargar tus documentos.',
            style: context.textStyles.bodyMedium?.copyWith(
              color: context.colors.error,
            ),
          ),
          const SizedBox(height: AppSpacing.space16),
          AppButton(label: 'Reintentar', onPressed: _load),
        ],
      );
    }
    if (_rejected.isEmpty) {
      return Text(
        'Tu solicitud fue rechazada. Contacta a soporte para más '
        'información.',
        style: context.textStyles.bodyMedium,
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text(
          'Los siguientes documentos fueron rechazados. Vuelve a '
          'subirlos y luego envía tu solicitud de nuevo.',
          style: context.textStyles.bodyMedium,
        ),
        const SizedBox(height: AppSpacing.space16),
        for (final verification in _rejected) ...[
          DocumentUploadField(
            title: requiredProviderDocumentTitle(verification.type),
            description: requiredProviderDocumentDescription(verification.type),
            onUpload: (bytes, fileName, onProgress) async {
              final updated = await widget.repository.uploadDocument(
                verification: verification,
                fileBytes: bytes,
                fileName: fileName,
                onProgress: onProgress,
              );
              await widget.repository.resetVerificationStatus(updated);
            },
            onUploaded: (success) {
              if (success) {
                setState(() => _resolvedIds.add(verification.id.value));
              }
            },
          ),
          const SizedBox(height: AppSpacing.space12),
        ],
        const SizedBox(height: AppSpacing.space8),
        AppButton(
          label: 'Volver a enviar solicitud',
          isLoading: _resubmitting,
          onPressed: (_allResolved && !_resubmitting) ? _resubmit : null,
        ),
      ],
    );
  }
}
