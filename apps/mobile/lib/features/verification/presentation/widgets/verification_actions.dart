import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';

/// Explains, in one line, how identity verification is handled today.
///
/// This replaces four buttons — "Tomar foto", "Subir documento",
/// "Reintentar" and "Enviar verificación" — that all raised the same
/// "próximamente" snackbar. There is no camera/gallery capture flow
/// and no backend `Verification`-by-provider endpoint behind any of
/// them, so they promised a document-upload feature the app cannot
/// perform; on a screen about identity and trust, that is the worst
/// place to leave buttons that don't work.
class VerificationActions extends StatelessWidget {
  const VerificationActions({super.key});

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(
            Icons.info_outline,
            size: AppSpacing.space20,
            color: context.colors.secondary,
          ),
          const SizedBox(width: AppSpacing.space8),
          Expanded(
            child: Text(
              'Tu verificación se gestiona con nuestro equipo durante el '
              'registro. La carga de documentos desde la app estará '
              'disponible próximamente.',
              style: context.textStyles.bodySmall,
            ),
          ),
        ],
      ),
    );
  }
}
