import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../../../identity/models/document_type.dart';
import '../../models/verification_display.dart';

/// Recap of the identity on file — all of it real domain data from
/// `Identity`: full name, document type and the masked document
/// number, so the provider can verify at a glance that the account
/// holds the right document. No scanned image is shown (there is no
/// camera/gallery integration, and no official branding exists), so
/// the type/number are stated as text rather than mocked up as a
/// fake ID card. No color/icon stored anywhere — resolved here from
/// `context.colors.*`.
class DocumentPreview extends StatelessWidget {
  const DocumentPreview({super.key, required this.data});

  final VerificationDisplay data;

  String _labelFor(DocumentType type) {
    switch (type) {
      case DocumentType.nationalId:
        return 'Cédula de ciudadanía';
      case DocumentType.passport:
        return 'Pasaporte';
      case DocumentType.foreignId:
        return 'Cédula de extranjería';
      case DocumentType.taxId:
        return 'Identificación tributaria';
      case DocumentType.other:
        return 'Otro documento';
    }
  }

  @override
  Widget build(BuildContext context) {
    final identity = data.identity;

    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Documento de identidad'),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(AppSpacing.space16),
            decoration: BoxDecoration(
              border: Border.all(color: context.colors.outline),
              borderRadius: BorderRadius.circular(AppSpacing.space8),
            ),
            child: Row(
              children: [
                Icon(
                  Icons.badge_outlined,
                  size: AppSpacing.space40,
                  color: context.colors.secondary,
                ),
                const SizedBox(width: AppSpacing.space12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        identity.fullName,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: context.textStyles.titleSmall,
                      ),
                      const SizedBox(height: AppSpacing.space4),
                      Text(
                        _labelFor(identity.documentType),
                        style: context.textStyles.bodySmall,
                      ),
                      Text(
                        data.maskedDocumentNumber,
                        style: context.textStyles.bodySmall,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
