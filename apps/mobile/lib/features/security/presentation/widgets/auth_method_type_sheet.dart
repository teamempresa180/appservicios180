import 'package:flutter/material.dart';
import '../../../../authentication/models/auth_method_type.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import 'auth_method_type_labels.dart';

/// Bottom sheet listing every [AuthMethodType] so the user can pick
/// which one to add. Returns the chosen type via [Navigator.pop], or
/// `null` if the user dismisses it.
class AuthMethodTypeSheet extends StatelessWidget {
  const AuthMethodTypeSheet({super.key});

  static Future<AuthMethodType?> show(BuildContext context) {
    return showModalBottomSheet<AuthMethodType>(
      context: context,
      isScrollControlled: true,
      builder: (context) => const AuthMethodTypeSheet(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.space16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Agregar método de autenticación',
              style: context.textStyles.titleMedium,
            ),
            const SizedBox(height: AppSpacing.space12),
            for (final type in AuthMethodType.values)
              ListTile(
                leading: Icon(
                  authMethodTypeIcon(type),
                  color: context.colors.primary,
                ),
                title: Text(authMethodTypeLabel(type)),
                onTap: () => Navigator.of(context).pop(type),
              ),
          ],
        ),
      ),
    );
  }
}
