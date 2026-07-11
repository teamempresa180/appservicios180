import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_button.dart';

/// Bottom links of the Login screen: "forgot password" and "create
/// account". Both currently route to Register — password recovery has no
/// screen of its own yet (see the feature README).
class LoginFooter extends StatelessWidget {
  const LoginFooter({
    super.key,
    required this.onForgotPassword,
    required this.onCreateAccount,
  });

  final VoidCallback onForgotPassword;
  final VoidCallback onCreateAccount;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        AppButton(
          label: '¿Olvidaste tu contraseña?',
          onPressed: onForgotPassword,
          variant: AppButtonVariant.text,
          expand: false,
        ),
        const SizedBox(height: AppSpacing.space8),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('¿No tienes cuenta? ', style: context.textStyles.bodyMedium),
            AppButton(
              label: 'Crear cuenta',
              onPressed: onCreateAccount,
              variant: AppButtonVariant.text,
              expand: false,
            ),
          ],
        ),
      ],
    );
  }
}
