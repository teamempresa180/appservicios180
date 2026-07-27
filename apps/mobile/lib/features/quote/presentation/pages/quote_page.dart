import 'package:flutter/material.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/ui/animations/scale_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';
import '../../../../core/ui/widgets/app_loading.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../../../../core/ui/widgets/app_snack_bar.dart';
import '../../../orders/presentation/pages/orders_page.dart';
import '../../repositories/quote_repository.dart';
import '../view_models/quote_view_model.dart';
import '../widgets/address_resume.dart';
import '../widgets/confirm_quote_button.dart';
import '../widgets/estimated_time.dart';
import '../widgets/price_breakdown.dart';
import '../widgets/provider_resume.dart';
import '../widgets/quote_header.dart';
import '../widgets/quote_notes.dart';
import '../widgets/schedule_resume.dart';
import '../widgets/service_resume.dart';

/// Quote screen. Does NOT build its own `Scaffold` — it is meant to be
/// inserted into the existing navigation flow later, the same way
/// every other feature so far does. Completely independent: its own
/// repository, its own view model, loaded from the real backend via
/// [QuoteViewModel] (resolved from the service locator — see
/// `core/di/service_locator.dart`).
///
/// Shows a single, fixed quote (no id-based lookup yet) — see the
/// feature README. "Confirmar solicitud" accepts the real `Quote` via
/// `QuoteRepository.acceptQuote`.
class QuotePage extends StatefulWidget {
  const QuotePage({super.key, QuoteRepository? repository})
    : _repository = repository;

  /// Overridable for tests only — production call sites always resolve
  /// the real repository from the service locator.
  final QuoteRepository? _repository;

  @override
  State<QuotePage> createState() => _QuotePageState();
}

class _QuotePageState extends State<QuotePage> {
  late final QuoteRepository _repository =
      widget._repository ?? locator<QuoteRepository>();
  late final QuoteViewModel _viewModel = QuoteViewModel(_repository);

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

  Future<void> _confirm() async {
    final data = _viewModel.data!;
    await _repository.acceptQuote(data.quote);
    if (!mounted) return;
    AppSnackBar.show(
      context,
      'Cotización confirmada.',
      type: AppSnackBarType.success,
    );
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (context) => Scaffold(
          appBar: AppBar(title: const Text('Mis órdenes')),
          body: const SafeArea(child: OrdersPage()),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    switch (_viewModel.status) {
      case QuoteLoadStatus.loading:
        return const AppPageBody(
          body: AppLoading(message: 'Cargando cotización...'),
        );
      case QuoteLoadStatus.error:
        return AppPageBody(
          body: AppEmptyState(
            icon: AppIcons.error,
            title: 'No se pudo cargar la cotización',
            description: _viewModel.errorMessage,
            actionLabel: 'Reintentar',
            onActionPressed: _viewModel.retry,
          ),
        );
      case QuoteLoadStatus.success:
        final data = _viewModel.data!;
        return AppPageBody(
          header: QuoteHeader(data: data),
          body: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              SlideIn(child: ServiceResume(data: data)),
              const SizedBox(height: AppSpacing.space16),
              SlideIn(child: ProviderResume(data: data)),
              const SizedBox(height: AppSpacing.space16),
              SlideIn(child: AddressResume(data: data)),
              const SizedBox(height: AppSpacing.space16),
              ScaleIn(child: ScheduleResume(data: data)),
              const SizedBox(height: AppSpacing.space16),
              SlideIn(child: EstimatedTime(data: data)),
              const SizedBox(height: AppSpacing.space16),
              SlideIn(child: PriceBreakdown(data: data)),
              const SizedBox(height: AppSpacing.space16),
              SlideIn(child: QuoteNotes(data: data)),
              const SizedBox(height: AppSpacing.space16),
              ConfirmQuoteButton(onPressed: _confirm),
            ],
          ),
        );
    }
  }
}
