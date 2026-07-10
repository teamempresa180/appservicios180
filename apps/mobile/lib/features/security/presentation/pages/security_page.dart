import 'package:flutter/material.dart';
import '../../../../core/ui/animations/fade_in.dart';
import '../../../../core/ui/animations/scale_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../models/security_display.dart';
import '../../repositories/mock_security_repository.dart';
import '../widgets/add_auth_method_button.dart';
import '../widgets/auth_method_card.dart';
import '../widgets/security_empty_state.dart';
import '../widgets/security_header.dart';
import '../widgets/security_loading.dart';
import '../widgets/security_statistics.dart';

/// The three purely-visual states this screen can render — same
/// fixed-`state` approach as every list/detail feature since `search`.
enum SecurityViewState { loading, empty, information }

/// Security screen. Does NOT build its own `Scaffold` — it is meant to
/// live within the existing navigation flow (opened from `Settings`).
/// Completely independent: its own repository, its own mock data.
///
/// Shows a fixed list of authentication methods (no id-based lookup
/// yet) — see the feature README.
class SecurityPage extends StatelessWidget {
  const SecurityPage({super.key, this.state = SecurityViewState.information});

  final SecurityViewState state;

  SecurityDisplay _buildData() {
    final repository = MockSecurityRepository();

    return SecurityDisplay(
      identity: repository.getIdentity(),
      authMethods: repository.getAuthMethods(),
    );
  }

  Widget _buildBody() {
    switch (state) {
      case SecurityViewState.loading:
        return const SecurityLoading();
      case SecurityViewState.empty:
        return const SecurityEmptyState();
      case SecurityViewState.information:
        final data = _buildData();
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            ScaleIn(child: SecurityStatistics(data: data)),
            const SizedBox(height: AppSpacing.space16),
            SlideIn(
              child: Column(
                children: [
                  for (final authMethod in data.authMethods) ...[
                    AuthMethodCard(authMethod: authMethod),
                    const SizedBox(height: AppSpacing.space12),
                  ],
                ],
              ),
            ),
            const AddAuthMethodButton(),
          ],
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          FadeIn(child: SecurityHeader(data: _buildData())),
          const SizedBox(height: AppSpacing.space16),
          _buildBody(),
        ],
      ),
    );
  }
}
