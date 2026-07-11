import 'package:flutter/material.dart';
import '../theme/app_brand_palette.dart';
import '../tokens/app_radius.dart';

/// The four semantic tones an `AppSnackBar` can render as (see
/// `BRANDING.md`). No domain meaning — the caller decides which tone
/// fits the message.
enum AppSnackBarType { info, success, warning, error }

/// Generic themed snack bar with 4 semantic tones, all sourced from
/// `AppBrandPalette`. No domain meaning — the caller supplies the
/// message and picks a [AppSnackBarType].
abstract final class AppSnackBar {
  static Color _backgroundFor(AppSnackBarType type) {
    switch (type) {
      case AppSnackBarType.info:
        return AppBrandPalette.info500;
      case AppSnackBarType.success:
        return AppBrandPalette.success500;
      case AppSnackBarType.warning:
        return AppBrandPalette.warning500;
      case AppSnackBarType.error:
        return AppBrandPalette.error500;
    }
  }

  /// Shows a floating snack bar with [message], styled for [type]
  /// (default `info`).
  static void show(
    BuildContext context,
    String message, {
    AppSnackBarType type = AppSnackBarType.info,
  }) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          message,
          style: const TextStyle(color: AppBrandPalette.background50),
        ),
        backgroundColor: _backgroundFor(type),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppRadius.radius8),
        ),
      ),
    );
  }
}
