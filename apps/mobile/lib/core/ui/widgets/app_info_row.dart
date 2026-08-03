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

    // Both sides are flexible: neither the label ("Dirección de recogida
    // completa") nor the value ("Transferencia bancaria Bancolombia") is
    // length-bounded, and two bare `Text`s in a `Row` overflow the moment
    // their combined width exceeds a narrow screen. The label yields
    // first (it ellipsizes), the value keeps its natural width until it
    // has to shrink too, so the number stays readable — this row carries
    // prices across `PriceBreakdown`/`PaymentBreakdown`.
    final row = Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          child: Text(
            label,
            overflow: TextOverflow.ellipsis,
            style: labelStyle ?? textStyles.bodyMedium,
          ),
        ),
        const SizedBox(width: AppSpacing.space8),
        Flexible(
          child: Text(
            value,
            textAlign: TextAlign.end,
            overflow: TextOverflow.ellipsis,
            style: valueStyle ?? textStyles.titleMedium,
          ),
        ),
      ],
    );

    if (!padded) return row;

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: AppSpacing.space4),
      child: row,
    );
  }
}
