import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_button.dart';

/// "Tomar foto"/"Subir documento"/"Reintentar" actions. Purely visual
/// — every button is a documented no-op; it does not open a real
/// camera/gallery flow yet (see the feature README).
class VerificationActions extends StatelessWidget {
  const VerificationActions({
    super.key,
    this.onTakePhoto,
    this.onUploadDocument,
    this.onRetry,
  });

  final VoidCallback? onTakePhoto;
  final VoidCallback? onUploadDocument;
  final VoidCallback? onRetry;

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: AppSpacing.space8,
      runSpacing: AppSpacing.space8,
      children: [
        AppButton(
          label: 'Tomar foto',
          onPressed: onTakePhoto ?? () {},
          expand: false,
        ),
        AppButton(
          label: 'Subir documento',
          onPressed: onUploadDocument ?? () {},
          expand: false,
        ),
        AppButton(
          label: 'Reintentar',
          onPressed: onRetry ?? () {},
          expand: false,
        ),
      ],
    );
  }
}
