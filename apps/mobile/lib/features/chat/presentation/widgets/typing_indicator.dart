import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_radius.dart';
import '../../../../core/ui/tokens/app_spacing.dart';

/// "Escribiendo..." indicator, shown when `ChatDisplay.isTyping` is
/// true. **Fully simulated** — no real-time transport reports typing
/// state (see the feature README). Colors resolved from
/// `context.colors`, never hardcoded.
class TypingIndicator extends StatelessWidget {
  const TypingIndicator({super.key});

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: AppSpacing.space4),
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.space12,
          vertical: AppSpacing.space8,
        ),
        decoration: BoxDecoration(
          color: context.colors.surfaceContainerHighest,
          borderRadius: BorderRadius.circular(AppRadius.radius12),
        ),
        child: Text(
          'Escribiendo...',
          style: context.textStyles.bodySmall?.copyWith(
            color: context.colors.onSurface,
            fontStyle: FontStyle.italic,
          ),
        ),
      ),
    );
  }
}
