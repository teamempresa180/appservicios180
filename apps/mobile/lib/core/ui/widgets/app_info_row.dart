import 'package:flutter/material.dart';
import '../extensions/context_theme_extensions.dart';
import '../tokens/app_spacing.dart';

/// A labeled key→value row, spaced to the edges — the "label … value"
/// line repeated across summary/breakdown widgets (`PaymentBreakdown`,
/// `ServiceInformation`, `PriceBreakdown`, `ServiceSummary`).
///
/// [padded] (default `false`) optionally wraps the row in the same
/// `EdgeInsets.symmetric(vertical: AppSpacing.space4)` used by the
/// widgets that repeat this row several times in a list (e.g.
/// `PriceBreakdown`'s per-line items).
class AppInfoRow extends StatelessWidget {
  const AppInfoRow({
    super.key,
    required this.label,
    required this.value,
    this.labelStyle,
    this.valueStyle,
    this.padded = false,
  });

  final String label;
  final String value;
  final TextStyle? labelStyle;
  final TextStyle? valueStyle;
  final bool padded;

  @override
  Widget build(BuildContext context) {
    final textStyles = context.textStyles;

    final row = Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: labelStyle ?? textStyles.bodyMedium),
        Text(value, style: valueStyle ?? textStyles.titleMedium),
      ],
    );

    if (!padded) return row;

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: AppSpacing.space4),
      child: row,
    );
  }
}
