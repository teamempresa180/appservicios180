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
/// currently being accepted/rejected, if any.
class ProviderRequestsList extends StatelessWidget {
  const ProviderRequestsList({
    super.key,
    required this.requests,
    required this.onAccept,
    required this.onReject,
    this.busyOrderId,
    this.busyAction,
  });

  final List<ProviderRequestDisplay> requests;
  final ValueChanged<ProviderRequestDisplay> onAccept;
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
                onAccept: () => onAccept(request),
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
