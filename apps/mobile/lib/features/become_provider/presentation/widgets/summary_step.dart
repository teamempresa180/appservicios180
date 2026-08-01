import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_dialog.dart';
import '../../../../core/ui/widgets/app_info_row.dart';

/// Paso 5 ("Resumen"): a read-only review of everything collected in
/// Pasos 1-4, plus the one irreversible "Enviar" action (behind a
/// confirmation dialog — this is the call that creates the real
/// `Provider` record).
class SummaryStep extends StatelessWidget {
  const SummaryStep({
    super.key,
    required this.categoryName,
    required this.specializationName,
    required this.yearsOfExperience,
    required this.previousCompany,
    required this.isIndependent,
    required this.biography,
    required this.documentsUploadedCount,
    required this.documentsRequiredCount,
    required this.isSubmitting,
    required this.onSubmit,
  });

  final String categoryName;
  final String specializationName;
  final int yearsOfExperience;
  final String? previousCompany;
  final bool isIndependent;
  final String biography;
  final int documentsUploadedCount;
  final int documentsRequiredCount;
  final bool isSubmitting;
  final VoidCallback onSubmit;

  Future<void> _confirmAndSubmit(BuildContext context) async {
    final confirmed = await AppDialog.show<bool>(
      context,
      title: 'Enviar solicitud',
      content: const Text(
        '¿Enviar tu solicitud para convertirte en proveedor? Una vez '
        'enviada, tu cuenta quedará pendiente de verificación y no '
        'podrás editar esta información hasta que la revisemos.',
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(false),
          child: const Text('Cancelar'),
        ),
        FilledButton(
          onPressed: () => Navigator.of(context).pop(true),
          child: const Text('Enviar'),
        ),
      ],
    );
    if (confirmed == true) onSubmit();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        AppCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text('Especialización', style: context.textStyles.titleSmall),
              const SizedBox(height: AppSpacing.space12),
              AppInfoRow(label: 'Categoría', value: categoryName, padded: true),
              AppInfoRow(
                label: 'Especialización',
                value: specializationName,
                padded: true,
              ),
            ],
          ),
        ),
        const SizedBox(height: AppSpacing.space16),
        AppCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text('Experiencia', style: context.textStyles.titleSmall),
              const SizedBox(height: AppSpacing.space12),
              AppInfoRow(
                label: 'Años de experiencia',
                value: '$yearsOfExperience',
                padded: true,
              ),
              AppInfoRow(
                label: 'Empresa anterior',
                value: previousCompany ?? 'No aplica',
                padded: true,
              ),
              AppInfoRow(
                label: 'Modalidad',
                value: isIndependent ? 'Independiente' : 'Empresa',
                padded: true,
              ),
              const SizedBox(height: AppSpacing.space8),
              Text('Descripción profesional', style: context.textStyles.bodyMedium),
              const SizedBox(height: AppSpacing.space4),
              Text(biography, style: context.textStyles.bodySmall),
            ],
          ),
        ),
        const SizedBox(height: AppSpacing.space16),
        AppCard(
          child: Row(
            children: [
              Icon(
                documentsUploadedCount == documentsRequiredCount
                    ? Icons.check_circle
                    : Icons.warning_amber_outlined,
                color: documentsUploadedCount == documentsRequiredCount
                    ? context.colors.primary
                    : context.colors.error,
              ),
              const SizedBox(width: AppSpacing.space12),
              Expanded(
                child: Text(
                  'Documentos subidos: $documentsUploadedCount de '
                  '$documentsRequiredCount',
                  style: context.textStyles.bodyMedium,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: AppSpacing.space24),
        AppButton(
          label: 'Enviar solicitud',
          isLoading: isSubmitting,
          onPressed: isSubmitting ? null : () => _confirmAndSubmit(context),
        ),
      ],
    );
  }
}
