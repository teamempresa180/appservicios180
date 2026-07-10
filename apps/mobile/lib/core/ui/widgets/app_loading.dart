import 'package:flutter/material.dart';
import '../animations/fade_in.dart';
import '../tokens/app_spacing.dart';

/// Generic centered loading indicator. No domain meaning.
class AppLoading extends StatelessWidget {
  const AppLoading({super.key, this.message});

  final String? message;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // `strokeCap: round` is the Material 3 look for indeterminate
          // circular progress (vs. the squared-off Material 2 default).
          const CircularProgressIndicator(
            strokeWidth: 3,
            strokeCap: StrokeCap.round,
          ),
          if (message != null) ...[
            const SizedBox(height: AppSpacing.space12),
            FadeIn(
              child: Text(
                message!,
                style: Theme.of(context).textTheme.bodyMedium,
              ),
            ),
          ],
        ],
      ),
    );
  }
}
