import 'package:flutter/material.dart';
import '../tokens/app_curves.dart';
import '../tokens/app_durations.dart';

/// Where a [SlideIn] enters the screen from.
enum SlideInDirection { fromBottom, fromTop, fromLeft, fromRight }

/// Generic slide-in helper. No Lottie/Rive — plain implicit animation.
class SlideIn extends StatelessWidget {
  const SlideIn({
    super.key,
    required this.child,
    this.duration = AppDurations.medium,
    this.direction = SlideInDirection.fromBottom,
    this.distance = 24,
  });

  final Widget child;
  final Duration duration;
  final SlideInDirection direction;
  final double distance;

  Offset get _beginOffset => switch (direction) {
    SlideInDirection.fromBottom => Offset(0, distance),
    SlideInDirection.fromTop => Offset(0, -distance),
    SlideInDirection.fromLeft => Offset(-distance, 0),
    SlideInDirection.fromRight => Offset(distance, 0),
  };

  @override
  Widget build(BuildContext context) {
    return TweenAnimationBuilder<Offset>(
      tween: Tween(begin: _beginOffset, end: Offset.zero),
      duration: duration,
      curve: AppCurves.standard,
      builder: (context, offset, builtChild) {
        return Transform.translate(offset: offset, child: builtChild);
      },
      child: child,
    );
  }
}
