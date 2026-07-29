import 'package:flutter/material.dart';
import '../../../../core/ui/animations/fade_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/tokens/app_durations.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../models/provider_request_display.dart';
import 'provider_request_card.dart';

/// Vertical list of `ProviderRequestCard`s, entering with a staggered
/// fade+slide (see `staggerDelayFor`) — same entrance pattern as
/// `OrdersList`. [busyOrderId]/[busyAction] identify the single request
/// currently being acted on, if any (`'reject'`/`'quote'`/`'start'`/
/// `'complete'`).
class ProviderRequestsList extends StatelessWidget {
  const ProviderRequestsList({
    super.key,
    required this.requests,
    required this.onSubmitQuote,
    required this.onStart,
    required this.onComplete,
    required this.onReject,
    this.busyOrderId,
    this.busyAction,
  });

  final List<ProviderRequestDisplay> requests;
  final ValueChanged<ProviderRequestDisplay> onSubmitQuote;
  final ValueChanged<ProviderRequestDisplay> onStart;
  final ValueChanged<ProviderRequestDisplay> onComplete;
  final ValueChanged<ProviderRequestDisplay> onReject;
  final String? busyOrderId;
  final String? busyAction;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        for (final (index, request) in requests.indexed) ...[
          FadeIn(
            delay: staggerDelayFor(index),
            child: SlideIn(
              child: ProviderRequestCard(
                data: request,
                isBusy: busyOrderId == request.order.id.value,
                busyAction: busyOrderId == request.order.id.value
                    ? busyAction
                    : null,
                onSubmitQuote: () => onSubmitQuote(request),
                onStart: () => onStart(request),
                onComplete: () => onComplete(request),
                onReject: () => onReject(request),
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.space12),
        ],
      ],
    );
  }
}
