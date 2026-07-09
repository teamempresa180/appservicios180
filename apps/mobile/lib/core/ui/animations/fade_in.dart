import 'package:flutter/material.dart';
import '../tokens/app_durations.dart';

/// Generic fade-in helper. No Lottie/Rive — plain implicit animation.
class FadeIn extends StatelessWidget {
  const FadeIn({
    super.key,
    required this.child,
    this.duration = AppDurations.medium,
    this.delay = Duration.zero,
  });

  final Widget child;
  final Duration duration;
  final Duration delay;

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<void>(
      future: Future<void>.delayed(delay),
      builder: (context, snapshot) {
        final started = snapshot.connectionState == ConnectionState.done;
        return AnimatedOpacity(
          opacity: started ? 1 : 0,
          duration: duration,
          curve: Curves.easeOut,
          child: child,
        );
      },
    );
  }
}
