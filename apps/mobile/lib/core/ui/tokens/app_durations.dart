/// Reusable animation duration scale for the whole application.
abstract final class AppDurations {
  static const Duration fast = Duration(milliseconds: 180);
  static const Duration medium = Duration(milliseconds: 320);
  static const Duration slow = Duration(milliseconds: 450);

  /// Per-item delay step for staggered list entrances (see
  /// `FadeIn.delay`) — e.g. item N fades in at `staggerStep * N`.
  /// Deliberately small so a list of a handful of items finishes
  /// entering quickly and never reads as sluggish.
  static const Duration staggerStep = Duration(milliseconds: 40);

  /// Upper bound for a staggered item's delay, so a long list doesn't
  /// keep animating in new items well after the user has started
  /// scrolling — items beyond this point all enter together.
  static const Duration staggerCap = Duration(milliseconds: 240);
}

/// Computes the delay for item [index] in a staggered list entrance —
/// `index * AppDurations.staggerStep`, clamped to
/// `AppDurations.staggerCap`. Shared by every list that stages its
/// entrance so the cadence stays identical across features.
Duration staggerDelayFor(int index) {
  final step = AppDurations.staggerStep * index;
  return step > AppDurations.staggerCap ? AppDurations.staggerCap : step;
}
