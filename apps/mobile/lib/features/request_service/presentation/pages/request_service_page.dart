import 'package:flutter/material.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/ui/animations/scale_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';
import '../../../../core/ui/widgets/app_loading.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
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
/// see the feature README.
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
  late final RequestServiceViewModel _viewModel = RequestServiceViewModel(
    widget._repository ?? locator<RequestServiceRepository>(),
  );

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
                ),
              ),
              const SizedBox(height: AppSpacing.space16),
              SlideIn(child: AddressSummary(data: data)),
              const SizedBox(height: AppSpacing.space16),
              SlideIn(
                child: ProblemDescription(initialText: data.problemDescription),
              ),
              const SizedBox(height: AppSpacing.space16),
              SlideIn(child: AttachmentsSection(attachments: data.attachments)),
              const SizedBox(height: AppSpacing.space16),
              SlideIn(child: PrioritySelector(initialPriority: data.priority)),
              const SizedBox(height: AppSpacing.space16),
              const ContinueButton(),
            ],
          ),
        );
    }
  }
}
