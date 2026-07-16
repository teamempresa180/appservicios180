import 'package:flutter/material.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/ui/animations/scale_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';
import '../../../../core/ui/widgets/app_loading.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../repositories/trust_repository.dart';
import '../view_models/trust_view_model.dart';
import '../widgets/trust_factors.dart';
import '../widgets/trust_header.dart';
import '../widgets/trust_score_card.dart';

/// Trust screen. Does NOT build its own `Scaffold` — it is meant to
/// live within the existing navigation flow (opened from `Provider
/// Profile`). Loads from the real backend via [TrustViewModel]
/// (resolved from the service locator — see
/// `core/di/service_locator.dart`). No real scoring involved — see
/// the feature README.
class TrustPage extends StatefulWidget {
  const TrustPage({super.key, TrustRepository? repository})
    : _repository = repository;

  /// Overridable for tests only — production call sites always resolve
  /// the real repository from the service locator.
  final TrustRepository? _repository;

  @override
  State<TrustPage> createState() => _TrustPageState();
}

class _TrustPageState extends State<TrustPage> {
  late final TrustViewModel _viewModel = TrustViewModel(
    widget._repository ?? locator<TrustRepository>(),
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

  Widget _buildBody() {
    switch (_viewModel.status) {
      case TrustLoadStatus.loading:
        return const AppLoading(message: 'Cargando confianza...');
      case TrustLoadStatus.error:
        return AppEmptyState(
          icon: AppIcons.error,
          title: 'No se pudo cargar la confianza',
          description: _viewModel.errorMessage,
          actionLabel: 'Reintentar',
          onActionPressed: _viewModel.retry,
        );
      case TrustLoadStatus.success:
        final data = _viewModel.data!;
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            ScaleIn(child: TrustScoreCard(data: data)),
            const SizedBox(height: AppSpacing.space16),
            SlideIn(child: TrustFactors(data: data)),
          ],
        );
    }
  }

  Widget _buildHeader() {
    final data = _viewModel.data;
    if (data == null) {
      return const AppSectionTitle(title: 'Confianza y reputación');
    }
    return TrustHeader(data: data);
  }

  @override
  Widget build(BuildContext context) {
    return AppPageBody(header: _buildHeader(), body: _buildBody());
  }
}
