import 'package:flutter/material.dart';

/// The bare circular loading spinner, with no message and no
/// centering — the primitive `AppLoading` builds on top of. Useful on
/// its own wherever a screen needs an inline spinner (e.g. inside a
/// button — see `AppButton`'s own loading state, which uses the same
/// `strokeCap`/`strokeWidth` look but doesn't reuse this widget
/// directly since it also needs a fixed size for the crossfade).
class AppLoadingIndicator extends StatelessWidget {
  const AppLoadingIndicator({super.key, this.size = 36, this.strokeWidth = 3});

  final double size;
  final double strokeWidth;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      // `strokeCap: round` is the Material 3 look for indeterminate
      // circular progress (vs. the squared-off Material 2 default).
      child: CircularProgressIndicator(
        strokeWidth: strokeWidth,
        strokeCap: StrokeCap.round,
      ),
    );
  }
}
