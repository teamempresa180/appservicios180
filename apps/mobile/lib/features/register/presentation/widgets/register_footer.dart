import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_button.dart';

/// Bottom link of the Register screen: "already have an account? Log in".
/// Uses a [Wrap] instead of a [Row] so it degrades gracefully (wraps to a
/// second line) on narrow screens (down to 320px) instead of overflowing.
class RegisterFooter extends StatelessWidget {
  const RegisterFooter({super.key, required this.onLogin});

  final VoidCallback onLogin;

  @override
  Widget build(BuildContext context) {
    return Wrap(
      alignment: WrapAlignment.center,
      crossAxisAlignment: WrapCrossAlignment.center,
      spacing: AppSpacing.space4,
      children: [
        Text('¿Ya tienes cuenta?', style: context.textStyles.bodyMedium),
        AppButton(
          label: 'Iniciar sesión',
          onPressed: onLogin,
          variant: AppButtonVariant.text,
          expand: false,
        ),
      ],
    );
  }
}
