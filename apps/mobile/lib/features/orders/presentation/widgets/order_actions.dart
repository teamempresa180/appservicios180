import 'package:flutter/material.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../../../core/ui/widgets/app_dialog.dart';
import '../../../../core/ui/widgets/app_snack_bar.dart';
import '../../../../order/journey/order_journey_action.dart';
import '../../../../order/journey/order_journey_info.dart';
import '../../../chat/presentation/pages/chat_page.dart';
import '../../../chat/repositories/chat_repository.dart';
import '../../../quote/presentation/pages/quote_page.dart';
import '../../../reviews/presentation/pages/create_review_page.dart';
import '../../models/order_display.dart';
import '../../repositories/orders_repository.dart';

/// Renders exactly the buttons [journey] says are valid for this order
/// right now (see `ClientOrderJourney`, the single source of truth for
/// which `OrderJourneyAction`s apply) — never a fixed, status-only
/// button as before, and never a button that doesn't correspond to one
/// of [journey]'s own actions, per the explicit "no buttons that can't
/// be used" requirement.
///
/// Wires each [OrderJourneyActionKind] to its real behavior:
/// - `viewQuotes` → the order-scoped `QuotePage`.
/// - `cancelOrder` → `OrdersRepository.cancelOrder`, behind a
///   confirmation dialog (destructive, can't be undone).
/// - `openChat` → `ChatRepository.createOrGetForOrder`, then `ChatPage`
///   (same create-or-get pattern already used from `QuotePage` when a
///   quote is accepted).
/// - `rateProvider` → the order/provider-scoped `CreateReviewPage`.
///
/// Every other kind (`acceptQuote`/`startService`/`completeService`/
/// `submitQuote`) is provider-facing — `ClientOrderJourney` never emits
/// them, but the switch stays exhaustive and simply renders nothing for
/// one rather than crashing, in case that ever changes.
class OrderActions extends StatefulWidget {
  const OrderActions({
    super.key,
    required this.data,
    required this.journey,
    this.onChanged,
    OrdersRepository? ordersRepository,
    ChatRepository? chatRepository,
  }) : _ordersRepository = ordersRepository,
       _chatRepository = chatRepository;

  final OrderDisplay data;
  final OrderJourneyInfo journey;

  /// Called after a state-changing action (cancelling) completes
  /// successfully, so the caller can reload the order list.
  final VoidCallback? onChanged;

  /// Overridable for tests only — production call sites always resolve
  /// the real repositories from the service locator.
  final OrdersRepository? _ordersRepository;
  final ChatRepository? _chatRepository;

  @override
  State<OrderActions> createState() => _OrderActionsState();
}

class _OrderActionsState extends State<OrderActions> {
  late final OrdersRepository _ordersRepository =
      widget._ordersRepository ?? locator<OrdersRepository>();
  late final ChatRepository _chatRepository =
      widget._chatRepository ?? locator<ChatRepository>();

  /// Which action kind is currently in flight, if any — drives both
  /// which button shows its loading spinner and which buttons are
  /// disabled while it runs.
  OrderJourneyActionKind? _busyKind;

  /// Opens the order-scoped quotes screen and reloads the list on
  /// return — accepting a quote in there changes the order's status (and
  /// therefore which buttons this card should offer), so coming back to
  /// a card still showing "Ver cotizaciones" was plainly stale.
  Future<void> _openQuotes() async {
    await Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (context) => Scaffold(
          appBar: AppBar(title: const Text('Cotizaciones')),
          body: SafeArea(child: QuotePage(order: widget.data.order)),
        ),
      ),
    );
    if (!mounted) return;
    widget.onChanged?.call();
  }

  Future<void> _cancelOrder() async {
    final confirmed = await AppDialog.show<bool>(
      context,
      title: 'Cancelar solicitud',
      content: const Text(
        '¿Seguro que quieres cancelar esta solicitud? Esta acción no se '
        'puede deshacer.',
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(false),
          child: const Text('No'),
        ),
        FilledButton(
          onPressed: () => Navigator.of(context).pop(true),
          child: const Text('Sí, cancelar'),
        ),
      ],
    );
    if (confirmed != true || !mounted) return;

    setState(() => _busyKind = OrderJourneyActionKind.cancelOrder);
    try {
      await _ordersRepository.cancelOrder(widget.data.order);
      if (!mounted) return;
      AppSnackBar.show(
        context,
        'Solicitud cancelada.',
        type: AppSnackBarType.success,
      );
      widget.onChanged?.call();
    } catch (_) {
      if (!mounted) return;
      AppSnackBar.show(
        context,
        'No se pudo cancelar la solicitud. Intenta de nuevo.',
        type: AppSnackBarType.error,
      );
    } finally {
      if (mounted) setState(() => _busyKind = null);
    }
  }

  Future<void> _openChat() async {
    final providerId = widget.data.order.providerId;
    if (providerId == null) return;

    setState(() => _busyKind = OrderJourneyActionKind.openChat);
    try {
      await _chatRepository.createOrGetForOrder(widget.data.order, providerId);
      if (!mounted) return;
      Navigator.of(context).push(
        MaterialPageRoute<void>(
          builder: (context) => Scaffold(
            appBar: AppBar(title: const Text('Conversación')),
            body: const SafeArea(child: ChatPage()),
          ),
        ),
      );
    } catch (_) {
      if (!mounted) return;
      AppSnackBar.show(
        context,
        'No se pudo abrir el chat. Intenta de nuevo.',
        type: AppSnackBarType.error,
      );
    } finally {
      if (mounted) setState(() => _busyKind = null);
    }
  }

  /// Opens the rating form and reloads the list on return — once the
  /// review exists `ClientOrderJourney` stops emitting `rateProvider`,
  /// but without this reload the card kept offering "Calificar" for an
  /// order the client had just rated (and a second attempt fails).
  Future<void> _openCreateReview() async {
    final providerId = widget.data.provider?.id ?? widget.data.order.providerId;
    if (providerId == null) return;
    await Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (context) => Scaffold(
          appBar: AppBar(title: const Text('Calificar')),
          body: SafeArea(
            child: CreateReviewPage(
              order: widget.data.order,
              providerId: providerId,
            ),
          ),
        ),
      ),
    );
    if (!mounted) return;
    widget.onChanged?.call();
  }

  VoidCallback? _handlerFor(OrderJourneyActionKind kind) {
    switch (kind) {
      case OrderJourneyActionKind.viewQuotes:
        return _openQuotes;
      case OrderJourneyActionKind.cancelOrder:
        return _cancelOrder;
      case OrderJourneyActionKind.openChat:
        return _openChat;
      case OrderJourneyActionKind.rateProvider:
        return _openCreateReview;
      case OrderJourneyActionKind.acceptQuote:
      case OrderJourneyActionKind.startService:
      case OrderJourneyActionKind.completeService:
      case OrderJourneyActionKind.submitQuote:
        return null;
    }
  }

  @override
  Widget build(BuildContext context) {
    final actions = widget.journey.actions;
    if (actions.isEmpty) return const SizedBox.shrink();

    final isBusy = _busyKind != null;

    return Row(
      children: [
        for (final (index, action) in actions.indexed) ...[
          if (index > 0) const SizedBox(width: AppSpacing.space12),
          Expanded(
            child: AppButton(
              label: action.label,
              variant: index == 0
                  ? AppButtonVariant.filled
                  : AppButtonVariant.outlined,
              isLoading: _busyKind == action.kind,
              onPressed: isBusy ? null : _handlerFor(action.kind),
            ),
          ),
        ],
      ],
    );
  }
}
