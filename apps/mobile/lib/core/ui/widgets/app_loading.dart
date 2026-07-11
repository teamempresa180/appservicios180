import 'package:flutter/material.dart';
import '../animations/fade_in.dart';
import '../tokens/app_spacing.dart';
import 'app_loading_indicator.dart';

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
          const AppLoadingIndicator(),
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
