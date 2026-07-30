import 'package:flutter/material.dart';
import '../../../../category/entities/category.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/ui/animations/scale_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/network/http_exceptions.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';
import '../../../../core/ui/widgets/app_loading.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../../../../core/ui/widgets/app_snack_bar.dart';
import '../../../../profiles/entities/profile.dart';
import '../../../../provider/entities/provider.dart';
import '../../../../service/entities/service.dart';
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
/// meant to be inserted into the existing navigation flow, the same way
/// every other feature so far does.
///
/// Now accepts real navigation-time context instead of showing a single
/// fixed service/provider: [category] is always required, and
/// [provider]/[service]/[profile] are given together for a **direct
/// hire** (the client picked a specific provider + one of their
/// services) or omitted altogether for an **open request** (client only
/// picked a category — any compatible provider may quote it later). On
/// submit, "Continuar" creates the real `Order` via
/// `RequestServiceRepository.createOrder` with the matching shape, then
/// opens the order-scoped Quote/status screen for the order just
/// created.
class RequestServicePage extends StatefulWidget {
  const RequestServicePage({
    super.key,
    required this.category,
    this.provider,
    this.service,
    this.profile,
    RequestServiceRepository? repository,
  }) : _repository = repository;

  final Category category;
  final Provider? provider;
  final Service? service;
  final Profile? profile;

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
    category: widget.category,
    provider: widget.provider,
    service: widget.service,
    profile: widget.profile,
  );

  DateTime? _selectedDate;
  String? _selectedTime;
  String? _problemDescription;
  RequestPriority? _priority;
  bool _isSubmitting = false;

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
    if (_isSubmitting) return;
    final data = _viewModel.data!;
    final description = (_problemDescription ?? data.problemDescription).trim();
    if (description.isEmpty) {
      AppSnackBar.show(
        context,
        'Cuéntanos brevemente qué necesitas antes de continuar.',
        type: AppSnackBarType.error,
      );
      return;
    }

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
    if (scheduledDate.isBefore(DateTime.now())) {
      AppSnackBar.show(
        context,
        'La fecha y hora programadas ya pasaron. Elige un horario futuro.',
        type: AppSnackBarType.error,
      );
      return;
    }

    setState(() => _isSubmitting = true);
    try {
      final order = await _repository.createOrder(
        categoryId: data.category.id,
        providerId: data.provider?.id,
        serviceId: data.service?.id,
        title: data.service?.name ?? data.category.name,
        description: description,
        scheduledDate: scheduledDate,
        priority: _priority ?? data.priority,
      );
      if (!mounted) return;
      AppSnackBar.show(
        context,
        'Solicitud enviada.',
        type: AppSnackBarType.success,
      );
      Navigator.of(context).push(
        MaterialPageRoute<void>(
          builder: (context) => Scaffold(
            appBar: AppBar(title: const Text('Cotización')),
            body: SafeArea(child: QuotePage(order: order)),
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
      if (mounted) setState(() => _isSubmitting = false);
    }
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
              if (data.service != null) ...[
                SlideIn(child: ServiceSummary(data: data)),
                const SizedBox(height: AppSpacing.space16),
              ],
              if (data.provider != null) ...[
                SlideIn(child: ProviderSummary(data: data)),
                const SizedBox(height: AppSpacing.space16),
              ],
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
              ContinueButton(onPressed: _submit, isLoading: _isSubmitting),
            ],
          ),
        );
    }
  }
}
