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
import '../../../quote/presentation/pages/quote_page.dart';
import '../../models/request_priority.dart';
import '../../repositories/request_service_repository.dart';
import '../view_models/request_service_view_model.dart';
import '../widgets/address_summary.dart';
import '../widgets/attachments_section.dart';
import '../widgets/continue_button.dart';
import '../widgets/priority_selector.dart';
import '../widgets/problem_description.dart';
import '../widgets/provider_summary.dart';
import '../widgets/request_service_header.dart';
import '../widgets/schedule_selector.dart';
import '../widgets/service_summary.dart';

/// Request Service screen. Does NOT build its own `Scaffold` — it is
/// meant to be inserted into the existing navigation flow later, the
/// same way every other feature so far does. Completely independent:
/// its own repository, its own view model, loaded from the real
/// backend via [RequestServiceViewModel] (resolved from the service
/// locator — see `core/di/service_locator.dart`).
///
/// Shows a single, fixed service/provider (no id-based lookup yet) —
/// see the feature README. "Continuar" submits the schedule/
/// description/priority the user picked as a real `Order` via
/// `RequestServiceRepository.createOrder`.
class RequestServicePage extends StatefulWidget {
  const RequestServicePage({super.key, RequestServiceRepository? repository})
    : _repository = repository;

  /// Overridable for tests only — production call sites always resolve
  /// the real repository from the service locator.
  final RequestServiceRepository? _repository;

  @override
  State<RequestServicePage> createState() => _RequestServicePageState();
}

class _RequestServicePageState extends State<RequestServicePage> {
  late final RequestServiceRepository _repository =
      widget._repository ?? locator<RequestServiceRepository>();
  late final RequestServiceViewModel _viewModel = RequestServiceViewModel(
    _repository,
  );

  DateTime? _selectedDate;
  String? _selectedTime;
  String? _problemDescription;
  RequestPriority? _priority;

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

  Future<void> _submit() async {
    final data = _viewModel.data!;
    final date = _selectedDate ?? data.selectedDate;
    final time = _selectedTime ?? data.selectedTime;
    final timeParts = time.split(':');
    final scheduledDate = DateTime(
      date.year,
      date.month,
      date.day,
      int.parse(timeParts[0]),
      int.parse(timeParts[1]),
    );
    await _repository.createOrder(
      service: data.service,
      provider: data.provider,
      title: data.service.name,
      description: _problemDescription ?? data.problemDescription,
      scheduledDate: scheduledDate,
      priority: _priority ?? data.priority,
    );
    if (!mounted) return;
    AppSnackBar.show(
      context,
      'Solicitud enviada.',
      type: AppSnackBarType.success,
    );
    // `QuotePage` has no id-based lookup yet (see its own doc comment)
    // — it still shows a single fixed quote, not one scoped to the
    // order just created above. Documented, pre-existing limitation.
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (context) => Scaffold(
          appBar: AppBar(title: const Text('Cotización')),
          body: const SafeArea(child: QuotePage()),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    switch (_viewModel.status) {
      case RequestServiceLoadStatus.loading:
        return const AppPageBody(
          body: AppLoading(message: 'Cargando solicitud...'),
        );
      case RequestServiceLoadStatus.error:
        return AppPageBody(
          body: AppEmptyState(
            icon: AppIcons.error,
            title: 'No se pudo cargar la solicitud',
            description: _viewModel.errorMessage,
            actionLabel: 'Reintentar',
            onActionPressed: _viewModel.retry,
          ),
        );
      case RequestServiceLoadStatus.success:
        final data = _viewModel.data!;
        return AppPageBody(
          header: RequestServiceHeader(data: data),
          body: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              SlideIn(child: ServiceSummary(data: data)),
              const SizedBox(height: AppSpacing.space16),
              SlideIn(child: ProviderSummary(data: data)),
              const SizedBox(height: AppSpacing.space16),
              ScaleIn(
                child: ScheduleSelector(
                  initialDate: data.selectedDate,
                  initialTime: data.selectedTime,
                  onDateChanged: (date) => _selectedDate = date,
                  onTimeChanged: (time) => _selectedTime = time,
                ),
              ),
              const SizedBox(height: AppSpacing.space16),
              SlideIn(child: AddressSummary(data: data)),
              const SizedBox(height: AppSpacing.space16),
              SlideIn(
                child: ProblemDescription(
                  initialText: data.problemDescription,
                  onChanged: (text) => _problemDescription = text,
                ),
              ),
              const SizedBox(height: AppSpacing.space16),
              SlideIn(child: AttachmentsSection(attachments: data.attachments)),
              const SizedBox(height: AppSpacing.space16),
              SlideIn(
                child: PrioritySelector(
                  initialPriority: data.priority,
                  onChanged: (priority) => _priority = priority,
                ),
              ),
              const SizedBox(height: AppSpacing.space16),
              ContinueButton(onPressed: _submit),
            ],
          ),
        );
    }
  }
}
