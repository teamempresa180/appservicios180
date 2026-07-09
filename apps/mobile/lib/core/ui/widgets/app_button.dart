import 'package:flutter/material.dart';
import '../tokens/app_durations.dart';
import '../tokens/app_radius.dart';
import '../tokens/app_spacing.dart';

/// Generic, theme-driven button. Carries no business meaning — only a
/// label, an optional loading state and a tap callback.
///
/// States:
/// - **normal**: [onPressed] set, [isLoading] false.
/// - **pressed**: handled automatically by `FilledButton`'s Material
///   ink/overlay — no extra code needed.
/// - **disabled**: [onPressed] is `null` (or [isLoading] is true) —
///   `FilledButton` dims itself using the Material 3 disabled style.
/// - **loading**: [isLoading] true — swaps the label for a spinner with
///   a short crossfade ([AppDurations.fast]).
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

  /// Fixed minimum height so the button doesn't change size when its
  /// content switches between the label and the loading spinner.
  ///
  /// Deliberately `Size(0, _height)`, NOT `Size.fromHeight(_height)`:
  /// `Size.fromHeight` returns `Size(double.infinity, height)`, which
  /// sets an infinite *minimum width* on the button. That is harmless
  /// only when the button is later stretched by a `SizedBox(width:
  /// double.infinity)` (the `expand: true` path — `BoxConstraints
  /// .enforce` clamps the infinite minimum down to the parent's actual
  /// bound there). With `expand: false`, the bare button keeps that
  /// infinite minimum width and crashes ("BoxConstraints forces an
  /// infinite width") the moment a parent that sizes non-flex children
  /// to their natural width — a `Row`, `Wrap`, the cross axis of a
  /// horizontal `ListView`, etc. — tries to lay it out. `Size(0,
  /// _height)` only floors the height; the width stays free to be
  /// whatever the content/parent needs, in every layout.
  static const double _height = AppSpacing.space48;

  @override
  Widget build(BuildContext context) {
    final button = FilledButton(
      onPressed: isLoading ? null : onPressed,
      style: FilledButton.styleFrom(
        minimumSize: const Size(0, _height),
        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.space16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppRadius.radius8),
        ),
      ),
      child: AnimatedSwitcher(
        duration: AppDurations.fast,
        child: isLoading
            ? const SizedBox(
                key: ValueKey('loading'),
                height: AppSpacing.space20,
                width: AppSpacing.space20,
                child: CircularProgressIndicator(strokeWidth: 2),
              )
            : Text(label, key: const ValueKey('label')),
      ),
    );

    return expand ? SizedBox(width: double.infinity, child: button) : button;
  }
}
