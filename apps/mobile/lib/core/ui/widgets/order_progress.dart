import 'package:flutter/material.dart';
import '../../../order/journey/order_journey_stage.dart';
import '../extensions/context_theme_extensions.dart';
import '../theme/app_brand_palette.dart';
import '../tokens/app_durations.dart';
import '../tokens/app_spacing.dart';

/// Reusable vertical timeline for an Order's service journey — shared
/// by both the client and provider experience (see
/// `order/journey/order_journey_stage.dart` for why this widget only
/// knows about the presentation-neutral [OrderJourneyStage] enum, never
/// an `Order`/`Quote` directly). Renders [stages] in order, marking
/// every stage before [current] as done (check), [current] itself as
/// active (filled, animated), and the rest as upcoming (outline, muted)
/// — so a caller only has to say "here are the stages that apply to
/// this order, and here's the current one," never re-implement the
/// done/current/upcoming visual logic.
///
/// [cancelled] replaces the whole timeline with a single muted banner
/// step instead — a cancelled/rejected order isn't progressing through
/// stages anymore, so a partially-filled timeline would be misleading.
///
/// Deliberately just a list of stages + one current pointer, nothing
/// date/time-aware and nothing that talks to a repository — this is
/// exactly what makes it trivial to extend later (e.g. inserting a
/// live "on the way" sub-indicator with a map, or a timestamp per
/// stage) without touching every screen that already uses it.
class OrderProgress extends StatelessWidget {
  const OrderProgress({
    super.key,
    required this.stages,
    required this.current,
    this.cancelled = false,
    this.cancelledLabel = 'Cancelado',
  });

  /// The stages that apply to this particular order, in display order
  /// (a direct hire might skip [OrderJourneyStage.quotesReceived]
  /// entirely, for instance — the caller decides which apply).
  final List<OrderJourneyStage> stages;

  /// Which of [stages] is the current one. Must be one of [stages].
  final OrderJourneyStage current;

  final bool cancelled;
  final String cancelledLabel;

  @override
  Widget build(BuildContext context) {
    if (cancelled) {
      return _CancelledBanner(label: cancelledLabel);
    }

    final currentIndex = stages.indexOf(current);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        for (var i = 0; i < stages.length; i++)
          _TimelineStep(
            stage: stages[i],
            state: i < currentIndex
                ? _StepState.done
                : i == currentIndex
                ? _StepState.current
                : _StepState.upcoming,
            isLast: i == stages.length - 1,
          ),
      ],
    );
  }
}

enum _StepState { done, current, upcoming }

class _TimelineStep extends StatelessWidget {
  const _TimelineStep({
    required this.stage,
    required this.state,
    required this.isLast,
  });

  final OrderJourneyStage stage;
  final _StepState state;
  final bool isLast;

  @override
  Widget build(BuildContext context) {
    final color = switch (state) {
      _StepState.done => AppBrandPalette.success500,
      _StepState.current => AppBrandPalette.primary600,
      _StepState.upcoming => AppBrandPalette.secondary300,
    };

    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Column(
            children: [
              AnimatedContainer(
                duration: AppDurations.fast,
                width: 20,
                height: 20,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: state == _StepState.upcoming ? Colors.transparent : color,
                  border: Border.all(color: color, width: 2),
                ),
                child: state == _StepState.done
                    ? const Icon(Icons.check, size: 14, color: Colors.white)
                    : state == _StepState.current
                    ? Center(
                        child: Container(
                          width: 8,
                          height: 8,
                          decoration: const BoxDecoration(
                            shape: BoxShape.circle,
                            color: Colors.white,
                          ),
                        ),
                      )
                    : null,
              ),
              if (!isLast)
                Expanded(
                  child: Container(
                    width: 2,
                    margin: const EdgeInsets.symmetric(vertical: AppSpacing.space4),
                    color: state == _StepState.done
                        ? AppBrandPalette.success500
                        : AppBrandPalette.secondary200,
                  ),
                ),
            ],
          ),
          const SizedBox(width: AppSpacing.space12),
          Padding(
            padding: const EdgeInsets.only(bottom: AppSpacing.space20),
            child: Text(
              stage.shortLabel,
              style: context.textStyles.bodyMedium?.copyWith(
                color: state == _StepState.upcoming
                    ? AppBrandPalette.secondary500
                    : null,
                fontWeight: state == _StepState.current ? FontWeight.w700 : null,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _CancelledBanner extends StatelessWidget {
  const _CancelledBanner({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        const Icon(Icons.cancel_outlined, size: 20, color: AppBrandPalette.error500),
        const SizedBox(width: AppSpacing.space8),
        Text(
          label,
          style: context.textStyles.bodyMedium?.copyWith(
            color: AppBrandPalette.error500,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }
}
