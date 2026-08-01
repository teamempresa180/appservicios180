import 'package:flutter/material.dart';
import '../tokens/app_durations.dart';
import '../tokens/app_radius.dart';
import '../tokens/app_spacing.dart';

/// The four button emphasis levels Servicios 180° defines (see
/// `BRANDING.md`, "Botones"). `filled` is the default so every existing
/// call site (which never passed `variant`) keeps rendering exactly as
/// before.
enum AppButtonVariant {
  /// Highest emphasis — the primary call to action on a screen.
  filled,

  /// Medium-high emphasis — a secondary action next to a `filled` one.
  tonal,

  /// Medium emphasis — an alternative action with less visual weight
  /// than `tonal`.
  outlined,

  /// Lowest emphasis — inline/link-like actions (e.g. a form footer).
  text,
}

/// Generic, theme-driven button. Carries no business meaning — only a
/// label, an optional loading state, a tap callback and an emphasis
/// [variant].
///
/// States (identical across every variant):
/// - **normal**: [onPressed] set, [isLoading] false.
/// - **pressed**: handled automatically by Material's ink/overlay — no
///   extra code needed.
/// - **disabled**: [onPressed] is `null` (or [isLoading] is true) —
///   each variant dims itself using its own Material 3 disabled style.
/// - **loading**: [isLoading] true — swaps the label for a spinner with
///   a short crossfade ([AppDurations.fast]).
///
/// All four variants share the same shape (`AppRadius.radius8`), the
/// same minimum height/padding and the same loading crossfade — only
/// the `ButtonStyle` (which `Theme.of(context).colorScheme` role each
/// draws from) differs.
class AppButton extends StatelessWidget {
  const AppButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.isLoading = false,
    this.expand = true,
    this.variant = AppButtonVariant.filled,
  });

  final String label;
  final VoidCallback? onPressed;
  final bool isLoading;
  final bool expand;
  final AppButtonVariant variant;

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

  static final ButtonStyle _sharedShape = FilledButton.styleFrom(
    minimumSize: const Size(0, _height),
    padding: const EdgeInsets.symmetric(horizontal: AppSpacing.space16),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(AppRadius.radius8),
    ),
  );

  Widget _content() {
    return AnimatedSwitcher(
      duration: AppDurations.fast,
      child: isLoading
          ? const SizedBox(
              key: ValueKey('loading'),
              height: AppSpacing.space20,
              width: AppSpacing.space20,
              // `strokeCap: round` matches `AppLoadingIndicator`'s
              // Material 3 look — every other spinner in the app
              // (`AppLoading`, inline usages) uses round caps, so the
              // button's own spinner should read the same way instead of
              // showing squared-off line ends.
              child: CircularProgressIndicator(
                strokeWidth: 2,
                strokeCap: StrokeCap.round,
              ),
            )
          : Text(label, key: const ValueKey('label')),
    );
  }

  Widget _buildButton() {
    final onPressed = isLoading ? null : this.onPressed;
    final content = _content();

    return switch (variant) {
      AppButtonVariant.filled => FilledButton(
        onPressed: onPressed,
        style: _sharedShape,
        child: content,
      ),
      AppButtonVariant.tonal => FilledButton.tonal(
        onPressed: onPressed,
        style: _sharedShape,
        child: content,
      ),
      AppButtonVariant.outlined => OutlinedButton(
        onPressed: onPressed,
        style: _sharedShape,
        child: content,
      ),
      AppButtonVariant.text => TextButton(
        onPressed: onPressed,
        style: _sharedShape,
        child: content,
      ),
    };
  }

  @override
  Widget build(BuildContext context) {
    final button = _buildButton();
    return expand ? SizedBox(width: double.infinity, child: button) : button;
  }
}
