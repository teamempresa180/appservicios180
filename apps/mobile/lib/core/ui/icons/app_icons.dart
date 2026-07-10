import 'package:flutter/material.dart';

/// Curated set of generic Material Icons approved for use across the app.
/// No custom icon assets or icon fonts — only `Icons.*` references, kept
/// here so screens don't need to know which exact Material glyph to use.
abstract final class AppIcons {
  static const IconData back = Icons.arrow_back;
  static const IconData close = Icons.close;
  static const IconData check = Icons.check;
  static const IconData add = Icons.add;
  static const IconData edit = Icons.edit_outlined;
  static const IconData delete = Icons.delete_outline;
  static const IconData search = Icons.search;
  static const IconData filter = Icons.filter_list;
  static const IconData info = Icons.info_outline;
  static const IconData warning = Icons.warning_amber_outlined;
  static const IconData error = Icons.error_outline;
  static const IconData success = Icons.check_circle_outline;
  static const IconData empty = Icons.inbox_outlined;

  /// Official overflow-menu icon. The visual audit (Sprint 2 Branding
  /// & UX, Etapa 1) found features split between `more_horiz` (3
  /// places) and `more_vert` (1 place) with no shared token driving
  /// either choice — `more_horiz` was picked as official since it was
  /// already the majority.
  static const IconData more = Icons.more_horiz;
  static const IconData chevronRight = Icons.chevron_right;
}
