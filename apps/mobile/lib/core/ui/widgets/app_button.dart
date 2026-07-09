import 'package:flutter/material.dart';
import '../tokens/app_radius.dart';
import '../tokens/app_spacing.dart';

/// Generic, theme-driven button. Carries no business meaning — only a
/// label, an optional loading state and a tap callback.
class AppButton extends StatelessWidget {
  const AppButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.isLoading = false,
    this.expand = true,
  });

  final String label;
  final VoidCallback? onPressed;
  final bool isLoading;
  final bool expand;

  @override
  Widget build(BuildContext context) {
    final button = FilledButton(
      onPressed: isLoading ? null : onPressed,
      style: FilledButton.styleFrom(
        padding: const EdgeInsets.symmetric(vertical: AppSpacing.space16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppRadius.radius8),
        ),
      ),
      child: isLoading
          ? const SizedBox(
              height: AppSpacing.space20,
              width: AppSpacing.space20,
              child: CircularProgressIndicator(strokeWidth: 2),
            )
          : Text(label),
    );

    return expand ? SizedBox(width: double.infinity, child: button) : button;
  }
}
