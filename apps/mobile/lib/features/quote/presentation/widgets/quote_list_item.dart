import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_avatar.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../models/quote_data.dart';

/// A single submitted `Quote`: provider name/experience, proposed
/// price, estimated duration and notes, plus an "Aceptar" action —
/// accepting cascades the linked `Order` to `Accepted` on the real
/// backend (see `QuoteRepository.acceptQuote`'s doc comment).
class QuoteListItem extends StatelessWidget {
  const QuoteListItem({
    super.key,
    required this.entry,
    required this.onAccept,
    this.isAccepting = false,
    this.isEnabled = true,
  });

  final QuoteEntry entry;
  final VoidCallback onAccept;

  /// Whether this specific quote's "Aceptar" tap is in flight.
  final bool isAccepting;

  /// Whether this button should accept taps at all — `false` while a
  /// *different* quote in the same list is being accepted, so the user
  /// can't fire two `acceptQuote` calls for the same order at once.
  final bool isEnabled;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const AppAvatar(),
              const SizedBox(width: AppSpacing.space12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      entry.providerName,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: context.textStyles.titleSmall,
                    ),
                    Text(
                      '${entry.provider.yearsOfExperience} años de experiencia',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: context.textStyles.bodySmall,
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.space12),
          _InfoLine(
            label: 'Precio propuesto',
            value: '\$${entry.price.toStringAsFixed(2)}',
          ),
          const SizedBox(height: AppSpacing.space4),
          _InfoLine(
            label: 'Tiempo estimado',
            value: '${entry.estimatedTime} min',
          ),
          if (entry.notes.isNotEmpty) ...[
            const SizedBox(height: AppSpacing.space4),
            Text(entry.notes, style: context.textStyles.bodySmall),
          ],
          const SizedBox(height: AppSpacing.space12),
          AppButton(
            label: 'Aceptar cotización',
            onPressed: isEnabled ? onAccept : null,
            isLoading: isAccepting,
          ),
        ],
      ),
    );
  }
}

/// Same "label … value" shape as `AppInfoRow`, but with the label
/// wrapped in a `Flexible` so it never overflows at narrow widths —
/// `AppInfoRow` itself has no such wrapping, and this row's label
/// ("Precio propuesto"/"Tiempo estimado") is long enough to overflow at
/// 320px alongside its value otherwise.
class _InfoLine extends StatelessWidget {
  const _InfoLine({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Flexible(
          child: Text(
            label,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: context.textStyles.bodyMedium,
          ),
        ),
        const SizedBox(width: AppSpacing.space8),
        Text(value, style: context.textStyles.bodyMedium),
      ],
    );
  }
}
