import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../../../core/ui/widgets/app_loading.dart';
import '../../../../verification/entities/verification.dart';
import '../../../../verification/models/verification_type.dart';
import '../../models/required_provider_documents.dart';
import '../../repositories/become_provider_repository.dart';
import 'document_upload_field.dart';

/// Paso 4 ("Documentación"): one real upload per required document type
/// (see `requiredProviderDocuments`) — each backed by its own real
/// `Verification` record and a real `POST /verifications/:id/document`
/// call via [repository], with per-document progress/success/error
/// state (`DocumentUploadField`), not a fake checkbox. "Continuar"
/// enables only once every document has a `documentPath`.
class DocumentationStep extends StatefulWidget {
  const DocumentationStep({
    super.key,
    required this.repository,
    required this.onContinue,
  });

  final BecomeProviderRepository repository;
  final VoidCallback onContinue;

  @override
  State<DocumentationStep> createState() => _DocumentationStepState();
}

enum _Status { loading, loaded, error }

class _DocumentationStepState extends State<DocumentationStep> {
  _Status _status = _Status.loading;
  final Map<VerificationType, Verification> _verifications = {};

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
        _verifications
          ..clear()
          ..addEntries(verifications.map((v) => MapEntry(v.type, v)));
        _status = _Status.loaded;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() => _status = _Status.error);
    }
  }

  bool get _allUploaded =>
      _status == _Status.loaded &&
      requiredProviderDocuments.every(
        (type) => _verifications[type]?.documentPath != null,
      );

  @override
  Widget build(BuildContext context) {
    if (_status == _Status.loading) {
      return const AppLoading(message: 'Preparando tus documentos...');
    }
    if (_status == _Status.error) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            'No se pudieron preparar tus documentos.',
            style: context.textStyles.bodyMedium?.copyWith(
              color: context.colors.error,
            ),
          ),
          const SizedBox(height: AppSpacing.space16),
          AppButton(label: 'Reintentar', onPressed: _load),
        ],
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text(
          'Sube cada documento por separado. Aceptamos PDF o imagen, '
          'máximo 5 MB cada uno.',
          style: context.textStyles.bodyMedium,
        ),
        const SizedBox(height: AppSpacing.space16),
        for (final type in requiredProviderDocuments) ...[
          DocumentUploadField(
            title: requiredProviderDocumentTitle(type),
            description: requiredProviderDocumentDescription(type),
            initiallyUploaded: _verifications[type]?.documentPath != null,
            onUpload: (bytes, fileName, onProgress) async {
              final verification = _verifications[type]!;
              final updated = await widget.repository.uploadDocument(
                verification: verification,
                fileBytes: bytes,
                fileName: fileName,
                onProgress: onProgress,
              );
              _verifications[type] = updated;
            },
            onUploaded: (success) {
              if (success) setState(() {});
            },
          ),
          const SizedBox(height: AppSpacing.space12),
        ],
        const SizedBox(height: AppSpacing.space8),
        AppButton(
          label: 'Continuar',
          onPressed: _allUploaded ? widget.onContinue : null,
        ),
      ],
    );
  }
}
