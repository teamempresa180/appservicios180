import 'package:flutter/material.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/network/http_exceptions.dart';
import '../../../../core/ui/animations/fade_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../../../core/ui/widgets/app_dialog.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';
import '../../../../core/ui/widgets/app_loading.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../../../../core/ui/widgets/app_snack_bar.dart';
import '../../../../order/entities/order.dart';
import '../../../../provider/models/provider_id.dart';
import '../../../../quote/entities/quote.dart';
import '../../../chat/presentation/pages/chat_page.dart';
import '../../../chat/repositories/chat_repository.dart';
import '../../repositories/quote_repository.dart';
import '../view_models/quote_view_model.dart';
import '../widgets/quote_header.dart';
import '../widgets/quote_list_item.dart';

/// Order status / quotes screen. Does NOT build its own `Scaffold` — it
/// is meant to be inserted into the existing navigation flow, the same
/// way every other feature so far does.
///
/// Order-scoped and multi-quote-aware — shows every real `Quote`
/// submitted for [order] (an open request can receive several, from
/// different providers). Accepting one calls
/// `QuoteRepository.acceptQuote` (which cascades the linked `Order` to
/// `Accepted` on the real backend), then creates-or-gets the real chat
/// for this order and navigates into it — replacing the previous
/// unconditional "always go to `OrdersPage`" behavior.
class QuotePage extends StatefulWidget {
  const QuotePage({
    super.key,
    required this.order,
    QuoteRepository? repository,
    ChatRepository? chatRepository,
  }) : _repository = repository,
       _chatRepository = chatRepository;

  final Order order;

  /// Overridable for tests only — production call sites always resolve
  /// the real repositories from the service locator.
  final QuoteRepository? _repository;
  final ChatRepository? _chatRepository;

  @override
  State<QuotePage> createState() => _QuotePageState();
}

class _QuotePageState extends State<QuotePage> {
  late final QuoteRepository _repository =
      widget._repository ?? locator<QuoteRepository>();
  late final ChatRepository _chatRepository =
      widget._chatRepository ?? locator<ChatRepository>();
  late final QuoteViewModel _viewModel = QuoteViewModel(
    _repository,
    widget.order,
  );

  /// id of the quote currently being accepted, or `null` when none is
  /// in flight. Tracked by id (not a bare bool) so only the tapped
  /// `QuoteListItem` shows its spinner while every other one in the
  /// list is disabled instead of silently ignoring taps.
  Object? _acceptingQuoteId;

  @override
  void initState() {
    super.initState();
    _viewModel.load();
    _viewModel.addListener(_onViewModelChanged);
  }

  void _onViewModelChanged() => setState(() {});

  @override
  void dispose() {
    _viewModel.removeListener(_onViewModelChanged);
    _viewModel.dispose();
    super.dispose();
  }

  Future<void> _accept(Quote quote, ProviderId providerId) async {
    if (_acceptingQuoteId != null) return;

    final confirmed = await AppDialog.show<bool>(
      context,
      title: 'Aceptar cotización',
      content: const Text(
        '¿Confirmas que quieres aceptar esta cotización? Esta acción '
        'asigna el servicio a este proveedor y no se puede deshacer.',
      ),
      actions: [
        AppButton(
          label: 'Cancelar',
          variant: AppButtonVariant.text,
          expand: false,
          onPressed: () => Navigator.of(context).pop(false),
        ),
        AppButton(
          label: 'Aceptar',
          expand: false,
          onPressed: () => Navigator.of(context).pop(true),
        ),
      ],
    );
    if (confirmed != true || !mounted) return;

    setState(() => _acceptingQuoteId = quote.id);
    try {
      await _repository.acceptQuote(quote);
      // Ensures a real Chat exists for this order before navigating in
      // — `ChatPage` itself still has no id-based lookup yet (shows
      // whichever conversation `GET /chats` returns first), a
      // documented, pre-existing limitation this pass doesn't fix.
      await _chatRepository.createOrGetForOrder(widget.order, providerId);
      if (!mounted) return;
      AppSnackBar.show(
        context,
        'Cotización aceptada.',
        type: AppSnackBarType.success,
      );
      Navigator.of(context).push(
        MaterialPageRoute<void>(
          builder: (context) => Scaffold(
            appBar: AppBar(title: const Text('Conversación')),
            body: const SafeArea(child: ChatPage()),
          ),
        ),
      );
    } on HttpException catch (exception) {
      if (!mounted) return;
      AppSnackBar.show(
        context,
        exception.message,
        type: AppSnackBarType.error,
      );
    } finally {
      if (mounted) setState(() => _acceptingQuoteId = null);
    }
  }

  @override
  Widget build(BuildContext context) {
    switch (_viewModel.status) {
      case QuoteLoadStatus.loading:
        return const AppPageBody(
          body: AppLoading(message: 'Cargando cotizaciones...'),
        );
      case QuoteLoadStatus.error:
        return AppPageBody(
          body: AppEmptyState(
            icon: AppIcons.error,
            title: 'No se pudieron cargar las cotizaciones',
            description: _viewModel.errorMessage,
            actionLabel: 'Reintentar',
            onActionPressed: _viewModel.retry,
          ),
        );
      case QuoteLoadStatus.success:
        final entries = _viewModel.entries;
        return AppPageBody(
          header: QuoteHeader(order: widget.order, quoteCount: entries.length),
          body: entries.isEmpty
              ? const AppEmptyState(
                  icon: AppIcons.info,
                  title: 'Esperando cotizaciones',
                  description:
                      'Te avisaremos apenas un proveedor envíe su cotización.',
                )
              : Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    for (final entry in entries) ...[
                      FadeIn(
                        child: SlideIn(
                          child: QuoteListItem(
                            entry: entry,
                            onAccept: () =>
                                _accept(entry.quote, entry.provider.id),
                            isAccepting: _acceptingQuoteId == entry.quote.id,
                            isEnabled: _acceptingQuoteId == null,
                          ),
                        ),
                      ),
                      const SizedBox(height: AppSpacing.space12),
                    ],
                  ],
                ),
        );
    }
  }
}
