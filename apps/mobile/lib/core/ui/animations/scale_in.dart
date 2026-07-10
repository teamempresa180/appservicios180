import 'package:flutter/material.dart';
import '../tokens/app_curves.dart';
import '../tokens/app_durations.dart';

/// Generic scale-in helper. No Lottie/Rive — plain implicit animation.
class ScaleIn extends StatelessWidget {
  const ScaleIn({
    super.key,
    required this.child,
    this.duration = AppDurations.medium,
    this.beginScale = 0.9,
  });

  final Widget child;
  final Duration duration;
  final double beginScale;

  @override
  Widget build(BuildContext context) {
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: beginScale, end: 1),
      duration: duration,
      curve: AppCurves.playful,
      builder: (context, scale, builtChild) {
        return Transform.scale(scale: scale, child: builtChild);
      },
      child: child,
    );
  }
}
