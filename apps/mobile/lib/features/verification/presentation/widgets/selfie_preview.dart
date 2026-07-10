import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';

/// Neutral placeholder in place of a real selfie capture — no camera
/// integration, no official branding, same approach as
/// `DocumentPreview`. Fully simulated (a selfie has no domain field to
/// derive from — see the feature README). No color/icon stored
/// anywhere — resolved here from `context.colors.*`.
class SelfiePreview extends StatelessWidget {
  const SelfiePreview({super.key});

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Selfie'),
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
                    Icons.face_outlined,
                    size: AppSpacing.space48,
                    color: context.colors.secondary,
                  ),
                  const SizedBox(height: AppSpacing.space4),
                  Text('Selfie capturada', style: context.textStyles.bodySmall),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
