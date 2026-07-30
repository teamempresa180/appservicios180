import 'package:flutter/material.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/ui/animations/scale_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';
import '../../../../core/ui/widgets/app_loading.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../../../../service/entities/service.dart';
import '../../../request_service/presentation/pages/request_service_page.dart';
import '../../repositories/service_detail_repository.dart';
import '../../models/service_detail_data.dart';
import '../view_models/service_detail_view_model.dart';
import '../widgets/provider_information.dart';
import '../widgets/rating_summary.dart';
import '../widgets/request_service_button.dart';
import '../widgets/service_detail_header.dart';
import '../widgets/service_gallery.dart';
import '../widgets/service_information.dart';

/// Service Detail screen. Does NOT build its own `Scaffold` — it is
/// meant to be inserted into the App Shell later, the same way Home,
/// Marketplace, Categories and Search already are. Completely
/// independent of those features: its own repository, its own view
/// model.
///
/// Pass [service] when navigating here from a card that already has it
/// (Marketplace/Search) — that's what makes different cards open their
/// own real service instead of always the same one. Omitting it falls
/// back to [ServiceDetailRepository.getService]'s single fixed record
/// (only meant for tests/direct navigation without that context). Data
/// is loaded via [ServiceDetailViewModel] (resolved from the service
/// locator — see `core/di/service_locator.dart`).
class ServiceDetailPage extends StatefulWidget {
  const ServiceDetailPage({
    super.key,
    this.service,
    ServiceDetailRepository? repository,
  }) : _repository = repository;

  final Service? service;

  /// Overridable for tests only — production call sites always resolve
  /// the real repository from the service locator.
  final ServiceDetailRepository? _repository;

  @override
  State<ServiceDetailPage> createState() => _ServiceDetailPageState();
}

class _ServiceDetailPageState extends State<ServiceDetailPage> {
  late final ServiceDetailViewModel _viewModel = ServiceDetailViewModel(
    widget._repository ?? locator<ServiceDetailRepository>(),
    presetService: widget.service,
  );

  @override
  void initState() {
    super.initState();
    _viewModel.load();
    _viewModel.addListener(_onViewModelChanged);
  }

  void _onViewModelChanged() => setState(() {});

  /// Opens Request Service as a **direct hire** for this exact service's
  /// provider — mirrors `ProviderActions._openRequestService`'s
  /// single-service path (this screen already has one concrete
  /// [Service] in hand, so there is no "pick a service" step here).
  void _openRequestService(BuildContext context, ServiceDetailData data) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (context) => Scaffold(
          appBar: AppBar(title: const Text('Solicitar servicio')),
          body: SafeArea(
            child: RequestServicePage(
              category: data.category,
              provider: data.provider,
              service: data.service,
              profile: data.profile,
            ),
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _viewModel.removeListener(_onViewModelChanged);
    _viewModel.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return switch (_viewModel.status) {
      ServiceDetailLoadStatus.loading => const AppPageBody(
        body: AppLoading(message: 'Cargando servicio...'),
      ),
      ServiceDetailLoadStatus.error => AppPageBody(
        body: AppEmptyState(
          icon: AppIcons.error,
          title: 'No se pudo cargar el servicio',
          description: _viewModel.errorMessage,
          actionLabel: 'Reintentar',
          onActionPressed: _viewModel.retry,
        ),
      ),
      ServiceDetailLoadStatus.success => AppPageBody(
        header: ServiceDetailHeader(data: _viewModel.data!),
        body: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            ScaleIn(child: ServiceGallery(images: _viewModel.data!.images)),
            const SizedBox(height: AppSpacing.space16),
            SlideIn(child: ServiceInformation(data: _viewModel.data!)),
            const SizedBox(height: AppSpacing.space16),
            SlideIn(child: ProviderInformation(data: _viewModel.data!)),
            const SizedBox(height: AppSpacing.space16),
            SlideIn(child: RatingSummary(data: _viewModel.data!)),
            const SizedBox(height: AppSpacing.space16),
            RequestServiceButton(
              onPressed: () => _openRequestService(context, _viewModel.data!),
            ),
          ],
        ),
      ),
    };
  }
}
