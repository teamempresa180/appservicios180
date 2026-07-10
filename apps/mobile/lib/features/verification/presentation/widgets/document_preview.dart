import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../../../identity/models/document_type.dart';
import '../../models/verification_display.dart';

/// Recap of the identity document: type (real `Identity.documentType`)
/// and a neutral placeholder in place of a real scanned image (no
/// camera/gallery integration, no official branding — same approach as
/// `ServiceGallery` in `service_detail`). No color/icon stored
/// anywhere — resolved here from `context.colors.*`.
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
            height: 120,
            width: double.infinity,
            decoration: BoxDecoration(
              border: Border.all(color: context.colors.outline),
              borderRadius: BorderRadius.circular(AppSpacing.space8),
            ),
            child: Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    Icons.badge_outlined,
                    size: AppSpacing.space48,
                    color: context.colors.secondary,
                  ),
                  const SizedBox(height: AppSpacing.space4),
                  Text(
                    _labelFor(identity.documentType),
                    style: context.textStyles.bodySmall,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
